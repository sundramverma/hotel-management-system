import { useState } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import API from "../api";

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

    try {
      setLoading(true);
      setError(null);

      const { data } = await API.post("/users/login", {
        email,
        password,
      });

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

            <input className="form-control" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <input type="password" className="form-control" placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className="btn btn-primary mt-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
