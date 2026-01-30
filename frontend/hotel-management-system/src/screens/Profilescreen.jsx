import { useState } from "react";
import { Tabs } from "antd";
import API from "../api";
import Loader from "../components/Loader";
import Error from "../components/Error";

function ProfileScreen() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return <Error message="Please login to view profile" />;
  }

  /* ================= FETCH BOOKINGS ================= */
  async function fetchBookings() {
    try {
      setLoading(true);
      setError(null);

      const { data } = await API.post(
        "/bookings/getbookingbyuserid",
        { userid: user._id }
      );

      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to load bookings");
    }
  }

  /* ================= CANCEL BOOKING (HARD DELETE) ================= */
  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);

      await API.post("/bookings/cancelbooking", {
        bookingid,
        roomid,
      });

      await fetchBookings();
      setLoading(false);
    } catch (err) {
      console.error("Cancel error:", err);
      setLoading(false);
      alert("Cancel failed");
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Profile</h2>

      <Tabs
        defaultActiveKey="1"
        centered
        onChange={(key) => {
          if (key === "2" && bookings.length === 0) {
            fetchBookings();
          }
        }}
        items={[
          {
            label: "Profile Details",
            key: "1",
            children: (
              <div className="bs">
                <h3>Name: {user.name}</h3>
                <h3>Email: {user.email}</h3>
                <h3>Admin: {user.isAdmin ? "YES" : "NO"}</h3>
              </div>
            ),
          },
          {
            label: "Bookings",
            key: "2",
            children: (
              <div>
                {loading && <Loader />}
                {error && <Error message={error} />}

                {!loading && bookings.length === 0 && (
                  <p>No bookings found</p>
                )}

                {!loading &&
                  bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bs d-flex justify-content-between align-items-center mb-3"
                    >
                      <div>
                        <h4>{booking.room}</h4>
                        <p>
                          From: {booking.fromdate} — To: {booking.todate}
                        </p>
                        <p>Total Amount: ₹{booking.totalamount}</p>
                      </div>

                      <div>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            cancelBooking(
                              booking._id,
                              booking.roomid
                            )
                          }
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export default ProfileScreen;
