import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./../styles/Auth.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaSpinner } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (form.password !== form.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/register/`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        }
      );

      navigate("/login", { state: { message: "Registration successful! Please login." } });
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      if (error.response?.data) {
        const errors = Object.values(error.response.data).flat();
        setError(errors.join(" "));
      } else {
        setError("Registration failed. Please try again.");
      }
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
            <h1 className="auth-title">📚 Create Account</h1>
            <p className="auth-subtitle">Join the Exam Portal today</p>
          </div>

          <form onSubmit={registerUser}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                className="auth-input"
                name="username"
                value={form.username}
                placeholder="Username"
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                className="auth-input"
                name="email"
                type="email"
                value={form.email}
                placeholder="Email"
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                disabled={loading}
                minLength="8"
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                className="auth-input"
                type="password"
                name="password2"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <FaUserTag className="input-icon" />
              <select
                className="auth-input"
                name="role"
                onChange={handleChange}
                disabled={loading}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinning" /> Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
