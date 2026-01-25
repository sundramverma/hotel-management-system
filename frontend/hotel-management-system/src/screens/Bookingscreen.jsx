import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

function BookingScreen() {
  const { roomid, fromdate, todate } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔒 DATE VALIDATION
  const from = moment(fromdate, "DD-MM-YYYY", true);
  const to = moment(todate, "DD-MM-YYYY", true);

  if (!from.isValid() || !to.isValid()) {
    return <Error message="Invalid booking dates" />;
  }

  const totalDays = to.diff(from, "days") + 1;
  const totalAmount = room ? room.rentperday * totalDays : 0;

  // 🔹 LOGIN CHECK (TAB-WISE)
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) {
    return <Error message="Please login to book room" />;
  }

  // 🔹 FETCH ROOM
  useEffect(() => {
    async function fetchRoom() {
      try {
        const { data } = await axios.post("/api/rooms/getroombyid", {
          roomid,
        });
        setRoom(data);
        setLoading(false);
      } catch {
        setError("Failed to load room details");
        setLoading(false);
      }
    }
    fetchRoom();
  }, [roomid]);

  // 🔹 PAYMENT + BOOKING
  async function onToken(token) {
    try {
      setLoading(true);

      await axios.post("/api/bookings/bookroom", {
        room: room.name,
        roomid: room._id,
        userid: user._id,
        fromdate,
        todate,
        totalamount: totalAmount,
        totalDays,
        token,
      });

      setLoading(false);

      Swal.fire("Success", "Room booked successfully", "success").then(() => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire(
        "Booking Failed",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  }

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="container mt-5">
      <div className="row bs">
        <div className="col-md-5">
          <h2>{room.name}</h2>
          <img
            src={room.imageurls[0]}
            alt={room.name}
            className="bigimg"
          />
        </div>

        <div className="col-md-6 text-right">
          <h3>Booking Details</h3>
          <p><b>From:</b> {fromdate}</p>
          <p><b>To:</b> {todate}</p>
          <p><b>Total Days:</b> {totalDays}</p>
          <p><b>Total Amount:</b> ₹{totalAmount}</p>

          <StripeCheckout
            amount={totalAmount * 100}
            token={onToken}
            currency="INR"
            stripeKey="pk_test_51StDM7FJ4rKXJf5TgQDFFF2IaICUOcvShorrjTyiUYfb7szkoxvMDmRW3RrHBJ1WXGwsju1jwGoLT6dc9YiRF2nw00iUWKY4fs"
          >
            <button className="btn btn-primary mt-3">
              Pay Now
            </button>
          </StripeCheckout>
        </div>
      </div>
    </div>
  );
}

export default BookingScreen;
