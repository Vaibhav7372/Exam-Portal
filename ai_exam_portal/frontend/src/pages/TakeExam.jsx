import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../services/api";
import "./../styles/ExamDetail.css";

function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/exams/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setExam(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load exam questions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  const questions = useMemo(() => exam?.questions || [], [exam]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await axios.post(
        `${API_BASE_URL}/api/exams/${id}/submit/`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/results");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Your session expired. Please login again.");
      } else {
        setError("Could not submit exam. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="exam-detail-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading exam...</p>
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
          <button onClick={() => navigate(`/exam/${id}`)} className="btn-back">
            Back to Exam Details
          </button>

          <div className="exam-detail-card">
            <div className="exam-detail-header">
              <h1 className="exam-title">{exam?.title || "Exam"}</h1>
              <p className="exam-description">
                Answer all available questions and submit when finished.
              </p>
            </div>

            {error && (
              <div className="error-state">
                <p>{error}</p>
              </div>
            )}

            {questions.length === 0 ? (
              <div className="error-state">
                <p>No questions are available for this exam yet.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                  <div key={question.id} className="exam-instructions">
                    <h3>
                      Question {index + 1} ({question.marks} marks)
                    </h3>
                    <p>{question.question_text}</p>

                    {question.question_type === "mcq" ? (
                      <div className="exam-info-grid">
                        {["option_a", "option_b", "option_c", "option_d"]
                          .filter((optionKey) => question[optionKey])
                          .map((optionKey) => (
                            <label key={optionKey} className="info-item">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={question[optionKey]}
                                checked={answers[question.id] === question[optionKey]}
                                onChange={(event) =>
                                  handleAnswerChange(question.id, event.target.value)
                                }
                              />
                              <span>{question[optionKey]}</span>
                            </label>
                          ))}
                      </div>
                    ) : (
                      <textarea
                        className="auth-input"
                        rows="4"
                        value={answers[question.id] || ""}
                        onChange={(event) =>
                          handleAnswerChange(question.id, event.target.value)
                        }
                        placeholder="Type your answer"
                      />
                    )}
                  </div>
                ))}

                <div className="exam-actions">
                  <button
                    className="btn-start-exam"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Exam"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TakeExam;
