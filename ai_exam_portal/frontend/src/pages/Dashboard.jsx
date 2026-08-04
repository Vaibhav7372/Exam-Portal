import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./../styles/Dashboard.css";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../services/api";
import { FaBell, FaFileAlt, FaCheckCircle, FaStar, FaClock, FaArrowRight, FaCalendar, FaHourglassHalf, FaQuestionCircle, FaSearch, FaFilter } from 'react-icons/fa';

function Dashboard() {
  const [data, setData] = useState(null);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    averageScore: 0
  });
  const [filters, setFilters] = useState({
    subject: 'all',
    status: 'all',
    search: ''
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Math Exam starts in 2 hours', type: 'warning' },
    { id: 2, message: 'Science Exam results published', type: 'success' },
    { id: 3, message: 'New exam added: English Literature', type: 'info' }
  ]);

  // Fetch dashboard data
  useEffect(() => {
    const token = localStorage.getItem("access");
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [dashboardRes, examsRes, resultsRes] = await Promise.all([
  axios.get(`${API_BASE_URL}/api/dashboard/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  axios.get(`${API_BASE_URL}/api/exams/`),
  axios.get(`${API_BASE_URL}/api/results/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
]);

        setData(dashboardRes.data);
      setExams(examsRes.data);
        
        const userResults = Array.isArray(resultsRes.data) ? resultsRes.data : [];
        calculateStats(examsRes.data, userResults);
        setFilteredExams(examsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          // Handle token refresh or redirect to login
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const calculateStats = (examData, resultData = []) => {
    const total = examData.length;
    const completed = examData.filter(e => e.status === 'completed').length;
    const inProgress = examData.filter(e => e.status === 'ongoing').length;
    const upcoming = examData.filter(e => e.status === 'upcoming').length;
    const avgScore = resultData.length
      ? resultData.reduce((acc, result) => acc + Number(result.percentage || 0), 0) / resultData.length
      : 0;

    setStats({ total, completed, inProgress, upcoming, averageScore: Math.round(avgScore) });
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...exams];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Subject filter
    if (filters.subject !== 'all') {
      filtered = filtered.filter(exam =>
        exam.subject?.name?.toLowerCase() === filters.subject.toLowerCase()
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(exam =>
        exam.status === filters.status
      );
    }
    setFilteredExams(filtered);
  }, [exams, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Get unique subjects for filter
  const subjects = ['all', ...new Set(exams.map(e => e.subject?.name).filter(Boolean))];

  // Notification toggle
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="dashboard-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>Welcome back, {data?.user || 'Student'}! 👋</h1>
              <p className="subtitle">Here are your available exams</p>
            </div>
            <div className="header-actions">
              <div className="notification-wrapper">
                <button 
                  className="btn-notification" 
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <span className="notification-badge">{notifications.length}</span>
                  <FaBell />
                </button>
                {showNotifications && (
                  <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className={`notification-item ${notif.type}`}>
                          <span>{notif.message}</span>
                        </div>
                      ))
                    ) : (
                      <div className="notification-item">No notifications</div>
                    )}
                  </div>
                )}
              </div>
              <div className="user-avatar">
                <img src={`https://ui-avatars.com/api/?name=${data?.user || 'Student'}&background=3b82f6&color=fff&size=40`} alt="User" />
              </div>
            </div>
          </div>
        </div>

        {data && (
          <>
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card stat-total">
                <div className="stat-icon">
                  <FaFileAlt />
                </div>
                <div className="stat-info">
                  <h3>Total Exams</h3>
                  <p>{stats.total}</p>
                </div>
                <span className="stat-trend up">Available</span>
              </div>

              <div className="stat-card stat-completed">
                <div className="stat-icon">
                  <FaCheckCircle />
                </div>
                <div className="stat-info">
                  <h3>Completed</h3>
                  <p>{stats.completed}</p>
                </div>
                <span className="stat-trend up">
                  {stats.total > 0 ? Math.round((stats.completed/stats.total)*100) : 0}% done
                </span>
              </div>

              <div className="stat-card stat-score">
                <div className="stat-icon">
                  <FaStar />
                </div>
                <div className="stat-info">
                  <h3>Average Score</h3>
                  <p>{stats.averageScore}%</p>
                </div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${stats.averageScore}%` }}></div>
                </div>
              </div>

              <div className="stat-card stat-upcoming">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-info">
                  <h3>In Progress</h3>
                  <p>{stats.inProgress}</p>
                </div>
                <span className="stat-trend">
                  {stats.upcoming} upcoming
                </span>
              </div>
            </div>

            {/* Exam List */}
            <div className="exam-section">
              <div className="section-header">
                <h2>Available Exams</h2>
                <div className="filter-options">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search exams..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <select 
                    className="filter-select"
                    value={filters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject === 'all' ? 'All Subjects' : subject}
                      </option>
                    ))}
                  </select>
                  <select 
                    className="filter-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="exam-grid">
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <div key={exam.id} className="exam-card">
                      <div className="exam-card-header">
                        <div className="exam-status">
                          <span className={`status-badge ${exam.status || 'upcoming'}`}>
                            {exam.status || 'Upcoming'}
                          </span>
                          {exam.subject && (
                            <span className="subject-tag">{exam.subject.name}</span>
                          )}
                        </div>
                        <h3 className="exam-title">{exam.title}</h3>
                      </div>

                      <div className="exam-details">
                        <div className="detail-item">
                          <FaClock />
                          <span>{exam.duration} Minutes</span>
                        </div>
                        <div className="detail-item">
                          <FaStar />
                          <span>{exam.total_marks} Marks</span>
                        </div>
                        <div className="detail-item">
                          <FaQuestionCircle />
                          <span>{exam.question_count || 0} Questions</span>
                        </div>
                      </div>

                      <div className="exam-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${exam.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {exam.progress || 0}% Complete
                        </span>
                      </div>

                      <div className="exam-footer">
                        <div className="exam-meta">
                          <span className="exam-date">
                            <FaCalendar />
                            {exam.date || 'Dec 15, 2026'}
                          </span>
                          <span className="exam-time">
                            <FaHourglassHalf />
                            {exam.time || '10:00 AM'}
                          </span>
                        </div>
                        <Link to={`/exam/${exam.id}`} className="btn-view-exam">
                          {exam.status === 'completed' ? 'Review' : 'Start Exam'}
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-exams">
                    <p>No exams match your filters</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
