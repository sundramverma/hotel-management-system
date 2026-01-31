import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

import Loader from "../components/Loader";
import Error from "../components/Error";
import API from "../api";

function BookingScreen() {
  const { roomid, fromdate, todate } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const from = moment(fromdate, "DD-MM-YYYY", true);
  const to = moment(todate, "DD-MM-YYYY", true);

  if (!from.isValid() || !to.isValid()) {
    return <Error message="Invalid booking dates" />;
  }

  const totalDays = to.diff(from, "days") + 1;
  const totalAmount = room ? room.rentperday * totalDays : 0;

  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) {
    return <Error message="Please login to book room" />;
  }

  useEffect(() => {
    async function fetchRoom() {
      try {
        setLoading(true);
        const { data } = await API.post("/rooms/getroombyid", { roomid });
        setRoom(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load room");
        setLoading(false);
      }
    }
    fetchRoom();
  }, [roomid]);

  async function onToken(token) {
    try {
      setLoading(true);
      await API.post("/bookings/bookroom", {
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
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "Booking failed", "error");
    }
  }

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <>
      {/* 🔥 CSS INSIDE SAME FILE */}
      <style>{`
        .booking-box {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .booking-info {
          margin-top: 28px;
        }

        /* 👇 SHORTER LINE */
        .divider {
          width: 70%;
          margin-left: auto;
          border-top: 3px solid #000;
          margin-top: 26px;
          margin-bottom: 14px;
        }

        .booking-bottom {
          margin-top: auto;
          padding-top: 4px;
        }

        /* 👇 MOVE TOTAL AMOUNT UP */
        .total-amount {
          margin-bottom: 10px;
        }
      `}</style>

      <div className="container mt-5">
        <div className="row bs justify-content-between">

          {/* LEFT */}
          <div className="col-md-5">
            <h2 className="fw-bold">{room.name}</h2>
            <img
              src={room.imageurls?.[0]}
              alt={room.name}
              className="bigimg"
            />
          </div>

          {/* RIGHT */}
          <div className="col-md-5 booking-box">
            <h3 className="fw-bold">Booking Details</h3>

            <div className="booking-info">
              <p className="fw-semibold fs-5">
                <b>From:</b> {fromdate}
              </p>
              <p className="fw-semibold fs-5">
                <b>To:</b> {todate}
              </p>
              <p className="fw-semibold fs-5">
                <b>Total Days:</b> {totalDays}
              </p>
            </div>

            {/* 🔥 SHORT LINE */}
            <div className="divider"></div>

            {/* 🔥 BOTTOM */}
            <div className="booking-bottom">
              <p className="fw-bold fs-4 total-amount">
                Total Amount: ₹{totalAmount}
              </p>

              <StripeCheckout
                amount={totalAmount * 100}
                token={onToken}
                currency="INR"
                stripeKey="pk_test_51StDM7FJ4rKXJf5TgQDFFF2IaICUOcvShorrjTyiUYfb7szkoxvMDmRW3RrHBJ1WXGwsju1jwGoLT6dc9YiRF2nw00iUWKY4fs"
              >
                <button className="btn btn-dark px-5 py-2">
                  Pay Now
                </button>
              </StripeCheckout>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default BookingScreen;
