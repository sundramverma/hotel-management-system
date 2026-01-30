import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Room({ room, fromdate, todate }) {
  const [available, setAvailable] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      if (!fromdate || !todate) return;

      try {
        setChecking(true);

        const { data } = await API.post("/bookings/checkavailability", {
          roomid: room._id,
          fromdate,
          todate,
        });

        setAvailable(data.available);
      } catch (err) {
        console.error("Availability check failed", err);
        setAvailable(false);
      } finally {
        setChecking(false);
      }
    }

    checkAvailability();
  }, [fromdate, todate, room._id]);

  return (
    <>
      <div className="card p-3 bs">
        <img
          src={room.imageurls?.[0]}
          className="img-fluid"
          alt={room.name}
        />

        <h4 className="mt-2">{room.name}</h4>
        <p><b>Max Count:</b> {room.maxcount}</p>
        <p><b>Phone:</b> {room.phonenumber}</p>
        <p><b>Type:</b> {room.type}</p>

        {fromdate && todate && !checking && (
          <p style={{ fontWeight: "bold" }}>
            {available ? (
              <span style={{ color: "green" }}>Available</span>
            ) : (
              <span style={{ color: "red" }}>Not Available</span>
            )}
          </p>
        )}

        <div className="d-flex justify-content-between mt-3">
          {fromdate && todate && available ? (
            <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
              <button className="btn btn-dark">Book Now</button>
            </Link>
          ) : (
            <button className="btn btn-dark" disabled>
              Book Now
            </button>
          )}

          {/* ✅ VIEW DETAILS BUTTON BACK */}
          <button
            className="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target={`#roomModal${room._id}`}
          >
            View Details
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <div
        className="modal fade"
        id={`roomModal${room._id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{room.name}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <img
                src={room.imageurls?.[0]}
                className="img-fluid mb-3"
                alt={room.name}
              />

              <p><b>Description:</b> {room.description}</p>
              <p><b>Rent / Day:</b> ₹{room.rentperday}</p>
              <p><b>Max Count:</b> {room.maxcount}</p>
              <p><b>Phone:</b> {room.phonenumber}</p>
              <p><b>Type:</b> {room.type}</p>

              {room.facilities && (
                <p>
                  <b>Facilities:</b>{" "}
                  {room.facilities.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Room;
