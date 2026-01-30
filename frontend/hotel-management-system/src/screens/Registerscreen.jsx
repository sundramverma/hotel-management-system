import { useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import API from "../api";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function register() {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await API.post("/users/register", {
        name,
        email,
        password,
      });

      setLoading(false);
      setSuccess(true);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="container mt-5">
      {loading && <Loader />}
      {error && <Error message={error} />}
      {success && <Success message="Registration successful" />}

      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="bs">
            <h2>Register</h2>

            <input className="form-control" placeholder="Name"
              value={name} onChange={(e) => setName(e.target.value)} />

            <input className="form-control" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <input type="password" className="form-control" placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} />

            <input type="password" className="form-control" placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />

            <button className="btn btn-primary mt-3" onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
