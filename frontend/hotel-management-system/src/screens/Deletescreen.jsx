import { useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import API from "../api";

function Deletescreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function deleteAccount() {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account and all bookings."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError(null);

      await API.post("/users/delete", {
        email,
        password,
      });

      sessionStorage.removeItem("currentUser");
      setLoading(false);

      alert("Account and bookings deleted successfully");
      window.location.href = "/";
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="container mt-5">
      {loading && <Loader />}
      {error && <Error message={error} />}

      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="bs">
            <h2 className="text-dark">Delete My Account</h2>

            <input
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn btn-danger mt-3"
              onClick={deleteAccount}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deletescreen;
