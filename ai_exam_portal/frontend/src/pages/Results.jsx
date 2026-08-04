import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./../styles/Results.css";

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [overallStats, setOverallStats] = useState({
    totalExams: 0,
    averageScore: 0,
    totalMarks: 0,
    obtainedMarks: 0,
    bestScore: 0,
    worstScore: 0,
    passCount: 0,
    failCount: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    
    axios
      .get(`${API_BASE_URL}/api/results/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setResults(response.data);
        calculateStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        setLoading(false);
      });
  }, []);

  const calculateStats = (data) => {
    if (!data || data.length === 0) return;

    const total = data.length;
    const totalMarks = data.reduce((sum, r) => sum + r.total_marks, 0);
    const obtainedMarks = data.reduce((sum, r) => sum + r.obtained_marks, 0);
    const avgScore = (obtainedMarks / totalMarks) * 100;
    const scores = data.map(r => (r.obtained_marks / r.total_marks) * 100);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    const passCount = data.filter(r => (r.obtained_marks / r.total_marks) * 100 >= 40).length;
    const failCount = total - passCount;

    setOverallStats({
      totalExams: total,
      averageScore: Math.round(avgScore),
      totalMarks,
      obtainedMarks,
      bestScore: Math.round(bestScore),
      worstScore: Math.round(worstScore),
      passCount,
      failCount
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'average';
    return 'poor';
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 80) return '🏆';
    if (percentage >= 60) return '⭐';
    if (percentage >= 40) return '📚';
    return '💪';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="results-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your results...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="results-container">
        <div className="results-wrapper">
          {/* Header */}
          <div className="results-header">
            <div>
              <h1>📊 My Results</h1>
              <p className="subtitle">Track your exam performance and progress</p>
            </div>
            <div className="results-actions">
              <button className="btn-export">
                <i className="fas fa-download"></i> Export Report
              </button>
              <button className="btn-print" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          {results.length > 0 ? (
            <>
              <div className="stats-overview">
                <div className="stat-card stat-overview-card">
                  <div className="stat-icon-wrapper">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{overallStats.totalExams}</span>
                    <span className="stat-label">Total Exams</span>
                  </div>
                </div>
                <div className="stat-card stat-overview-card">
                  <div className="stat-icon-wrapper">
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{overallStats.averageScore}%</span>
                    <span className="stat-label">Average Score</span>
                  </div>
                </div>
                <div className="stat-card stat-overview-card">
                  <div className="stat-icon-wrapper">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{overallStats.bestScore}%</span>
                    <span className="stat-label">Best Score</span>
                  </div>
                </div>
                <div className="stat-card stat-overview-card">
                  <div className="stat-icon-wrapper">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{overallStats.passCount}</span>
                    <span className="stat-label">Passed</span>
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="detailed-stats">
                <div className="stats-card">
                  <h3>Performance Overview</h3>
                  <div className="performance-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Total Marks</span>
                      <span className="metric-value">{overallStats.totalMarks}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Obtained Marks</span>
                      <span className="metric-value">{overallStats.obtainedMarks}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Best Score</span>
                      <span className="metric-value">{overallStats.bestScore}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Worst Score</span>
                      <span className="metric-value">{overallStats.worstScore}%</span>
                    </div>
                  </div>
                  <div className="pass-fail-bar">
                    <div 
                      className="pass-bar" 
                      style={{ width: `${(overallStats.passCount / overallStats.totalExams) * 100}%` }}
                    >
                      <span>Passed</span>
                    </div>
                    <div 
                      className="fail-bar" 
                      style={{ width: `${(overallStats.failCount / overallStats.totalExams) * 100}%` }}
                    >
                      <span>Failed</span>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <h3>Score Distribution</h3>
                  <div className="score-distribution">
                    <div className="distribution-item">
                      <span>Excellent (80%+)</span>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill excellent" 
                          style={{ 
                            width: `${(results.filter(r => (r.obtained_marks / r.total_marks) * 100 >= 80).length / results.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="distribution-count">
                        {results.filter(r => (r.obtained_marks / r.total_marks) * 100 >= 80).length}
                      </span>
                    </div>
                    <div className="distribution-item">
                      <span>Good (60-79%)</span>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill good" 
                          style={{ 
                            width: `${(results.filter(r => (r.obtained_marks / r.total_marks) * 100 >= 60 && (r.obtained_marks / r.total_marks) * 100 < 80).length / results.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="distribution-count">
                        {results.filter(r => (r.obtained_marks / r.total_marks) * 100 >= 60 && (r.obtained_marks / r.total_marks) * 100 < 80).length}
                      </span>
                    </div>
                    <div className="distribution-item">
                      <span>Average (40-59%)</span>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill average" 
                          style={{ 
                            width: `${(results.filter(r => (r.obtained_marks / r.total_marks) * 100 >= 40 && (r.obtained_marks / r.total_marks) * 100 < 60).length / results.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="distribution-count">
                        {results.filter(r => (r.obtained_marks / r.total_marks) * 100 >= 40 && (r.obtained_marks / r.total_marks) * 100 < 60).length}
                      </span>
                    </div>
                    <div className="distribution-item">
                      <span>Poor (Below 40%)</span>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill poor" 
                          style={{ 
                            width: `${(results.filter(r => (r.obtained_marks / r.total_marks) * 100 < 40).length / results.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="distribution-count">
                        {results.filter(r => (r.obtained_marks / r.total_marks) * 100 < 40).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results List */}
              <div className="results-list-section">
                <div className="results-list-header">
                  <h2>Exam History</h2>
                  <div className="filter-controls">
                    <select className="filter-select">
                      <option>All Subjects</option>
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>English</option>
                    </select>
                    <select className="filter-select">
                      <option>Sort by: Latest</option>
                      <option>Sort by: Score (High to Low)</option>
                      <option>Sort by: Score (Low to High)</option>
                    </select>
                  </div>
                </div>

                <div className="results-list">
                  {results.map((result, index) => {
                    const percentage = Math.round((result.obtained_marks / result.total_marks) * 100);
                    const scoreColor = getScoreColor(percentage);
                    const grade = getGrade(percentage);
                    const emoji = getScoreEmoji(percentage);
                    
                    return (
                      <div key={index} className={`result-item ${scoreColor}`}>
                        <div className="result-item-header">
                          <div className="result-title-section">
                            <h3 className="result-title">{result.exam_title}</h3>
                            <span className="result-subject">{result.subject}</span>
                          </div>
                          <div className="result-status">
                            <span className={`status-badge ${percentage >= 40 ? 'passed' : 'failed'}`}>
                              {percentage >= 40 ? '✅ Passed' : '❌ Failed'}
                            </span>
                          </div>
                        </div>

                        <div className="result-details">
                          <div className="result-score-section">
                            <div className="score-circle">
                              <svg viewBox="0 0 120 120">
                                <circle 
                                  cx="60" 
                                  cy="60" 
                                  r="54" 
                                  fill="none" 
                                  stroke="#e2e8f0" 
                                  strokeWidth="8"
                                />
                                <circle 
                                  cx="60" 
                                  cy="60" 
                                  r="54" 
                                  fill="none" 
                                  stroke={percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#f59e0b' : '#ef4444'}
                                  strokeWidth="8"
                                  strokeDasharray={`${(percentage / 100) * 339.292} 339.292`}
                                  strokeLinecap="round"
                                  transform="rotate(-90 60 60)"
                                />
                                <text x="60" y="60" textAnchor="middle" dominantBaseline="central">
                                  <tspan className="score-percentage">{percentage}%</tspan>
                                </text>
                              </svg>
                              <div className="score-emoji">{emoji}</div>
                            </div>
                            <div className="result-marks">
                              <div className="marks-detail">
                                <span className="marks-label">Obtained</span>
                                <span className="marks-value">{result.obtained_marks}</span>
                              </div>
                              <div className="marks-detail">
                                <span className="marks-label">Total</span>
                                <span className="marks-value total">{result.total_marks}</span>
                              </div>
                              <div className="marks-detail">
                                <span className="marks-label">Grade</span>
                                <span className="marks-value grade">{grade}</span>
                              </div>
                            </div>
                          </div>

                          <div className="result-meta">
                            <div className="meta-item">
                              <i className="fas fa-calendar-alt"></i>
                              <span>{new Date(result.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="meta-item">
                              <i className="fas fa-clock"></i>
                              <span>{new Date(result.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            <div className="meta-item">
                              <i className="fas fa-question-circle"></i>
                              <span>{result.questions_attempted || 0} Questions</span>
                            </div>
                          </div>
                        </div>
{/* 
                        <div className="result-actions">
                          <Link to={`/exam/${result.exam_id}/review`} className="btn-review">
                            <i className="fas fa-eye"></i> Review Answers
                          </Link>
                          <Link to={`/exam/${result.exam_id}`} className="btn-retake">
                            <i className="fas fa-redo"></i> Retake Exam
                          </Link>
                        </div> */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <i className="fas fa-file-alt"></i>
                <h2>No Results Found</h2>
                <p>You haven't taken any exams yet. Start your first exam and track your progress!</p>
                <Link to="/exams" className="btn-primary">
                  <i className="fas fa-play"></i> Browse Exams
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Results;
