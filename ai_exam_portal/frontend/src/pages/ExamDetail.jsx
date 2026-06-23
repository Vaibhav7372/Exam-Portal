import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./../styles/ExamDetail.css";

function ExamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    
    axios
      .get(`http://127.0.0.1:8000/api/exams/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      .then((res) => {
        setExam(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load exam details");
        setLoading(false);
      });
  }, [id]);

  const handleStartExam = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/exam/${id}/take`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="exam-detail-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading exam details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !exam) {
    return (
      <>
        <Header />
        <div className="exam-detail-container">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error || "Exam not found"}</p>
            <button onClick={() => navigate("/dashboard")} className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="exam-detail-container">
        <div className="exam-detail-wrapper">
          <button onClick={() => navigate("/dashboard")} className="btn-back">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>

          <div className="exam-detail-card">
            {/* Header Section */}
            <div className="exam-detail-header">
              <div className="exam-badges">
                <span className={`status-badge ${exam.status || 'upcoming'}`}>
                  {exam.status || 'Upcoming'}
                </span>
                {exam.subject && (
                  <span className="subject-tag">{exam.subject.name}</span>
                )}
              </div>
              <h1 className="exam-title">{exam.title}</h1>
              <p className="exam-description">
                {exam.description || "Complete this exam to test your knowledge and track your progress."}
              </p>
            </div>

            {/* Info Grid */}
            <div className="exam-info-grid">
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Duration</span>
                  <span className="info-value">{exam.duration} Minutes</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <i className="fas fa-star"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Total Marks</span>
                  <span className="info-value">{exam.total_marks}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Questions</span>
                  <span className="info-value">{exam.question_count || 0}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Date</span>
                  <span className="info-value">{exam.date || 'To be announced'}</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            {exam.progress !== undefined && (
              <div className="exam-progress-section">
                <div className="progress-header">
                  <h3>Your Progress</h3>
                  <span className="progress-percentage">{exam.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${exam.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Instructions */}
            {exam.instructions && (
              <div className="exam-instructions">
                <h3><i className="fas fa-list-ul"></i> Instructions</h3>
                <p>{exam.instructions}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="exam-actions">
              <button 
                className={`btn-start-exam ${exam.status === 'completed' ? 'btn-review' : ''}`}
                onClick={handleStartExam}
              >
                <i className={`fas ${exam.status === 'completed' ? 'fa-redo' : 'fa-play'}`}></i>
                {exam.status === 'completed' ? ' Review Exam' : ' Start Exam'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ExamDetail;