import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const [open, setOpen] = useState(false);

  function logout() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <Link className="navbar-brand" to="/home">
        AASIYANA
      </Link>

      <ul className="navbar-nav ml-auto">
        {user ? (
          <li className="nav-item dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              onClick={() => setOpen(!open)}
            >
              {user.name}
            </button>

            {open && (
              <div className="dropdown-menu dropdown-menu-right show">
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>

                {user.isAdmin && (
                  <Link className="dropdown-item" to="/admin">
                    Admin
                  </Link>
                )}

                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
