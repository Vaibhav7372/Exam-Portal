import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./../styles/Auth.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/token/`,
        { username, password }
      );

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Optional: Fetch user role and store
      try {
        const userRes = await axios.get(`${API_BASE_URL}/api/dashboard/`, {
          headers: { Authorization: `Bearer ${response.data.access}` }
        });
        localStorage.setItem("userRole", userRes.data.role);
        localStorage.setItem("username", userRes.data.username);
      } catch (e) {
        console.error("Failed to fetch user data", e);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setError(error.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>  
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1 className="auth-title">📚 Exam Portal</h1>
            <p className="auth-subtitle">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinning" /> Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </> 
  );
}

export default Login;
