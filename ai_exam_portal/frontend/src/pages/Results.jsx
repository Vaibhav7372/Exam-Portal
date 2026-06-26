import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./../styles/Home.css";
import axios from "axios";

function Result() {

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            setError("Please login to view your results.");
            setLoading(false);
            return;
        }

        axios.get(
            "http://127.0.0.1:8000/api/results/",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            setResults(Array.isArray(response.data) ? response.data : []);
        })
        .catch(error => {
            console.error(error);
            if (error.response?.status === 401) {
                setError("Your session expired. Please login again.");
            } else {
                setError("Could not load results. Please try again.");
            }
        })
        .finally(() => {
            setLoading(false);
        });

    }, []);

    return (
        <div>
            <Header />

            <div className="home-page">
                <div className="container">
                    <div className="section-header">
                        <h1>Results</h1>
                    </div>

                    {loading && <p>Loading results...</p>}

                    {!loading && error && <p>{error}</p>}

                    {!loading && !error && results.length === 0 && (
                        <p>No results found for this logged-in user.</p>
                    )}

                    {!loading && !error && results.map((result) => (
                        <div key={result.id}>
                            <h3>Exam: {result.exam_title || result.exam}</h3>
                            <p>
                                Marks:
                                {result.obtained_marks}/
                                {result.total_marks}
                            </p>
                            <p>
                                Percentage:
                                {result.percentage}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Result;
