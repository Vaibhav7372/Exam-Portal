import "./../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>AI Exam Portal</h3>
            <p>Smart examination platform powered by AI</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/exams">Exams</Link></li>
              <li><Link to="/results">Results</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} AI Exam Portal. All Rights Reserved.</p>
          <p className="footer-version">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;