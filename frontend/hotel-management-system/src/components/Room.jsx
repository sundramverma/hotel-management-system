import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

/* 🔥 IMAGE NORMALIZER */
const normalizeImages = (imageurls) => {
  if (!imageurls) return [];

  // array of strings
  if (Array.isArray(imageurls) && typeof imageurls[0] === "string") {
    return imageurls;
  }

  // array of objects (cloudinary)
  if (Array.isArray(imageurls) && imageurls[0]?.url) {
    return imageurls.map((img) => img.url);
  }

  // single string
  if (typeof imageurls === "string") {
    return [imageurls];
  }

  return [];
};

function Room({ room, fromdate, todate }) {
  const [available, setAvailable] = useState(true);
  const [checking, setChecking] = useState(false);

  const images = normalizeImages(room.imageurls);

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
      {/* ================= ROOM CARD ================= */}
      <div className="card p-3 bs">
        <img
          src={images[0]}
          className="img-fluid"
          alt={room.name}
          style={{ height: "200px", objectFit: "cover" }}
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
              {/* 🔥 CAROUSEL */}
              {images.length > 0 && (
                <div
                  id={`carousel${room._id}`}
                  className="carousel slide mb-3"
                >
                  <div className="carousel-inner">
                    {images.map((img, index) => (
                      <div
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                        key={index}
                      >
                        <img
                          src={img}
                          className="d-block w-100"
                          alt={`room-${index}`}
                          style={{
                            height: "400px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* ⬅️ PREVIOUS */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#carousel${room._id}`}
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon"></span>
                      </button>

                      {/* ➡️ NEXT */}
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#carousel${room._id}`}
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon"></span>
                      </button>
                    </>
                  )}
                </div>
              )}

              <p><b>Description:</b> {room.description}</p>
              <p><b>Rent / Day:</b> ₹{room.rentperday}</p>
              <p><b>Max Count:</b> {room.maxcount}</p>
              <p><b>Phone:</b> {room.phonenumber}</p>
              <p><b>Type:</b> {room.type}</p>

              {room.facilities && room.facilities.length > 0 && (
                <p>
                  <b>Facilities:</b> {room.facilities.join(", ")}
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
