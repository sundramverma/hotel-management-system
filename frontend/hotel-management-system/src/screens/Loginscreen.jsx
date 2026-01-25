import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login() {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const user = {
      email,
      password,
    };

    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post("/api/users/login", user);

      // ✅ TAB-WISE LOGIN (IMPORTANT FIX)
      sessionStorage.setItem("currentUser", JSON.stringify(data));

      setLoading(false);
      window.location.href = "/home";
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  }

  return (
    <div className="container mt-5">
      {loading && <Loader />}
      {error && <Error message={error} />}

      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="bs">
            <h2>Login</h2>

            <input
              type="email"
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
              className="btn btn-primary mt-3"
              onClick={login}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
