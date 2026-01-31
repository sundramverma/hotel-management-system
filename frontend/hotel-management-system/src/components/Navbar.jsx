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
    <>
      {/* 🔥 HARD FIX CSS */}
      <style>
        {`
          .dropdown-fix {
            position: absolute;
            top: 100%;
            right: 0;
            transform: translateX(-100%); /* 👈 MAGIC LINE */
            margin-top: 8px;
            min-width: 230px;             /* Delete My Account fully visible */
            z-index: 1000;
          }
        `}
      </style>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand fw-bold" to="/home">
          AASIYANA
        </Link>

        <ul className="navbar-nav ms-auto align-items-center">
          {user ? (
            <li className="nav-item position-relative">
              <button
                className="btn btn-secondary dropdown-toggle"
                onClick={() => setOpen(!open)}
              >
                {user.name}
              </button>

              {open && (
                <div className="dropdown-menu show dropdown-fix">
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>

                  {user.isAdmin && (
                    <Link className="dropdown-item" to="/admin">
                      Admin
                    </Link>
                  )}

                  <Link
                    className="dropdown-item text-danger"
                    to="/delete-account"
                  >
                    Delete My Account
                  </Link>

                  <button className="dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li className="nav-item me-2">
                <Link className="btn btn-outline-light px-3" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-light px-3" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
