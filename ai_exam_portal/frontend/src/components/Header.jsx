import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/Header.css";
import logo from "./../assets/Header_logo.svg";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
    
    // Get username from localStorage if available
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="AI Exam Portal" />
            <span className="logo-text">Exam Portal</span>
          </Link>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/exams" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-file-alt"></i> Exams
              </Link>
            </li>
            <li>
              <Link to="/results" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-chart-bar"></i> Results
              </Link>
            </li>
          </ul>

          <div className="nav-right">
            {isLoggedIn ? (
              <div className="user-menu">
                <div className="user-info">
                  <i className="fas fa-user-circle user-icon"></i>
                  <span className="username">{username || "User"}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;