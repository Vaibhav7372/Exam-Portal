import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    exams: 0,
    students: 0,
    courses: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);

    // Fetch stats from API
    const fetchStats = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_BASE_URL}/api/stats/`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        // Fallback stats if API not available
        setStats({
          exams: 24,
          students: 1250,
          courses: 8,
          satisfaction: 94
        });
      }
    };
    fetchStats();
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <>
      <Header />
      <main className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-pulse"></span>
                AI-Powered Examination Platform
              </div>
              <h1 className="hero-title">
                Revolutionize Your <span className="highlight">Exam Experience</span>
              </h1>
              <p className="hero-description">
                Take smart, AI-powered exams with real-time feedback, 
                detailed analytics, and personalized learning paths. 
                Join thousands of students already improving their scores.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={handleGetStarted}>
                  {isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}
                  <i className="fas fa-arrow-right"></i>
                </button>
                <Link to="/exams" className="btn-secondary">
                  <i className="fas fa-eye"></i>
                  Browse Exams
                </Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">{stats.exams}+</span>
                  <span className="stat-label">Exams Available</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="stat-number">{stats.students}+</span>
                  <span className="stat-label">Active Students</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="stat-number">{stats.courses}</span>
                  <span className="stat-label">Subjects</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="stat-number">{stats.satisfaction}%</span>
                  <span className="stat-label">Satisfaction Rate</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <div className="floating-card card-1">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Learn</span>
                </div>
                <div className="floating-card card-2">
                  <i className="fas fa-brain"></i>
                  <span>Practice</span>
                </div>
                <div className="floating-card card-3">
                  <i className="fas fa-chart-line"></i>
                  <span>Excel</span>
                </div>
                <div className="hero-illustration">
                  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="200" r="180" fill="#eff6ff" />
                    <circle cx="200" cy="200" r="140" fill="#dbeafe" />
                    <circle cx="200" cy="200" r="100" fill="#bfdbfe" />
                    <circle cx="200" cy="200" r="60" fill="#3b82f6" />
                    <circle cx="200" cy="200" r="30" fill="white" />
                    <path d="M200 80 L200 320" stroke="#93c5fd" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M80 200 L320 200" stroke="#93c5fd" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Features</span>
              <h2 className="section-title">Why Choose AI Exam Portal?</h2>
              <p className="section-subtitle">
                Everything you need to succeed in your academic journey
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-robot"></i>
                </div>
                <h3>AI-Powered Questions</h3>
                <p>
                  Intelligent question generation adapts to your skill level,
                  providing personalized exam experiences.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <h3>Real-Time Analytics</h3>
                <p>
                  Get instant feedback and detailed performance insights to
                  track your progress and identify areas for improvement.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Secure & Reliable</h3>
                <p>
                  Enterprise-grade security with encrypted data and
                  secure authentication for peace of mind.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3>Access Anywhere</h3>
                <p>
                  Take exams on any device - desktop, tablet, or mobile.
                  Study on your schedule, anywhere.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Timed Exams</h3>
                <p>
                  Practice with real exam conditions including timed sessions
                  to build confidence and improve time management.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-certificate"></i>
                </div>
                <h3>Certificates</h3>
                <p>
                  Earn certificates upon completion and showcase your
                  achievements to potential employers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Process</span>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">
                Get started in three simple steps
              </p>
            </div>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <h4>Create Account</h4>
                <p>Sign up for free and choose your role as a student or teacher</p>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-icon">
                  <i className="fas fa-book-open"></i>
                </div>
                <h4>Browse & Select</h4>
                <p>Choose from a wide range of subjects and exam categories</p>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h4>Take Exam & Excel</h4>
                <p>Start your exam, get results instantly, and track your growth</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Testimonials</span>
              <h2 className="section-title">What Our Students Say</h2>
              <p className="section-subtitle">
                Real feedback from real users
              </p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "This platform completely changed how I prepare for exams. 
                  The AI questions are challenging but fair, and the analytics 
                  helped me focus on my weak areas."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff&size=40" alt="Sarah Johnson" />
                  </div>
                  <div>
                    <h4>Sarah Johnson</h4>
                    <span>Computer Science Student</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "The best exam platform I've ever used. The interface is clean, 
                  the questions are well-crafted, and the instant feedback is 
                  invaluable for learning."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=22c55e&color=fff&size=40" alt="Michael Chen" />
                  </div>
                  <div>
                    <h4>Michael Chen</h4>
                    <span>Engineering Student</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <p className="testimonial-text">
                  "I love how easy it is to access exams from anywhere. The 
                  mobile-friendly design means I can practice during my commute 
                  or whenever I have free time."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="https://ui-avatars.com/api/?name=Emma+Williams&background=f59e0b&color=fff&size=40" alt="Emma Williams" />
                  </div>
                  <div>
                    <h4>Emma Williams</h4>
                    <span>Medical Student</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Start Your Journey?</h2>
              <p>
                Join thousands of students who are already improving their 
                exam performance with AI-powered practice.
              </p>
              <button className="btn-primary btn-large" onClick={handleGetStarted}>
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started Now'}
                <i className="fas fa-arrow-right"></i>
              </button>
              <p className="cta-note">
                <i className="fas fa-check-circle"></i>
                Free to register • No credit card required
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
