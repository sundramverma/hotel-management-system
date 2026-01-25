import { Link } from "react-router-dom";
  

function Landingscreen() {
  return (
    <div className="landing d-flex align-items-center justify-content-center">
      <div className="text-center">

        {/* Animated Hotel Name */}
        <h1 className="hotel-name">AASIYANA</h1>

        {/* New Quote */}
        <h4 className="hotel-quote">
          “Where comfort meets care, and every stay feels like home.”
        </h4>

        <Link to="/home">
          <button className="btn landingbtn mt-4">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Landingscreen;
