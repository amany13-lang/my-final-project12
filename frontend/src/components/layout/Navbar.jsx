import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Leave Track
        </Link>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/create-leave">
                Create Leave
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/my-leaves">
                My Leaves
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-danger ms-3"
                onClick={logout}
              >
                Logout
              </button>
            </li>

            </ul>
        </div>
      </div>
    </nav>
  );
}