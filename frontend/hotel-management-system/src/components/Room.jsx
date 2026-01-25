import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Room({ room, fromdate, todate }) {
  const [available, setAvailable] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      if (!fromdate || !todate) return;

      try {
        setChecking(true);

        const { data } = await axios.post(
          "/api/bookings/checkavailability",
          {
            roomid: room._id,
            fromdate,
            todate,
          }
        );

        setAvailable(data.available);
      } catch {
        setAvailable(false);
      } finally {
        setChecking(false);
      }
    }

    checkAvailability();
  }, [fromdate, todate, room._id]);

  return (
    <div className="card p-3 bs">
      <img src={room.imageurls[0]} className="img-fluid" alt={room.name} />

      <h4 className="mt-2">{room.name}</h4>
      <p><b>Max Count:</b> {room.maxcount}</p>
      <p><b>Phone:</b> {room.phonenumber}</p>
      <p><b>Type:</b> {room.type}</p>

      {fromdate && todate && !checking && (
        <p style={{ fontWeight: "bold" }}>
          {available ? (
            <span style={{ color: "green" }}>Room Available</span>
          ) : (
            <span style={{ color: "red" }}>Room Not Available</span>
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

        <button
          className="btn btn-dark"
          data-toggle="modal"
          data-target={`#roomModal${room._id}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default Room;
