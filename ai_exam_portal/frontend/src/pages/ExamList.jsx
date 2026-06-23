import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./../styles/ExamList.css";

function ExamList() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/exams/")
      .then((res) => {
        setExams(res.data);
        setFilteredExams(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = exams;
    
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterSubject !== "all") {
      filtered = filtered.filter(exam =>
        exam.subject?.name?.toLowerCase() === filterSubject.toLowerCase()
      );
    }
    
    setFilteredExams(filtered);
  }, [searchTerm, filterSubject, exams]);

  const subjects = ['all', ...new Set(exams.map(e => e.subject?.name).filter(Boolean))];

  if (loading) {
    return (
      <>
        <Header />
        <div className="exam-list-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading exams...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="exam-list-container">
        <div className="exam-list-wrapper">
          <div className="exam-list-header">
            <div>
              <h1>Available Exams</h1>
              <p className="subtitle">Browse and take your exams</p>
            </div>
            <span className="exam-count">{filteredExams.length} Exams Available</span>
          </div>

          <div className="exam-list-filters">
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <i className="fas fa-filter filter-icon"></i>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="filter-select"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="exam-list-grid">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <div key={exam.id} className="exam-card">
                  <div className="exam-card-content">
                    <div className="exam-card-top">
                      <div className="exam-badges">
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
                      <span className="detail-item">
                        <i className="fas fa-clock"></i>
                        {exam.duration} min
                      </span>
                      <span className="detail-item">
                        <i className="fas fa-star"></i>
                        {exam.total_marks} marks
                      </span>
                      <span className="detail-item">
                        <i className="fas fa-question-circle"></i>
                        {exam.question_count || 0} questions
                      </span>
                    </div>

                    <div className="exam-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${exam.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{exam.progress || 0}% complete</span>
                    </div>

                    <Link to={`/exam/${exam.id}`} className="exam-view-btn">
                      View Details <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-exams">
                <i className="fas fa-search"></i>
                <p>No exams found matching your criteria</p>
                <button onClick={() => {
                  setSearchTerm("");
                  setFilterSubject("all");
                }} className="clear-filters-btn">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ExamList;