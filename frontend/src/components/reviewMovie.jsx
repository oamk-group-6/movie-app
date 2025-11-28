import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import SearchBar from "./searchBar.jsx";
import { Navigate } from "react-router-dom";

import "./reviewMovie.css"

const API_URL = process.env.REACT_APP_API_URL

//***BANANAMETER***
function BananaMeter({ value, onChange }) {
    const barRef = useRef(null);
    const dragging = useRef(false);

    const updateValue = (e) => {
        const rect = barRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
        onChange(Math.round(percent));
    };

    return (
        <div
            className="banana-meter"
            ref={barRef}
            onMouseDown={(e) => {
                dragging.current = true;
                updateValue(e);
            }}
            onMouseMove={(e) => dragging.current && updateValue(e)}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
        >
            <div className="banana-meter-fill" style={{ width: `${value}%` }}></div>
            <span className="banana-meter-text">{value}% 🍌</span>
        </div>
    );
}

export default function MovieDetail() {
    const isLoggedIn = localStorage.getItem("token");
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [rating, setRating] = useState(50);
    const [reviewText, setReviewText] = useState("");

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        fetch(`${API_URL}/movies/${id}`)
            .then(res => res.json())
            .then(data => setMovie(data));
    }, [id]);

    if (!movie) return <p>Loading...</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (reviewText.trim().length === 0) {
            alert("Review cannot be empty.");
            return;
        }

        const reviewData = {
            movieId: Number(id),
            rating: rating,
            review: reviewText
        };

        try {
            const response = await fetch(`${API_URL}/ratings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(reviewData)
            });

            const data = await response.json();

            alert("Review submitted!");
            setReviewText("");
            setRating(50);

        } catch (err) {
            console.error(err);
            alert("Network error while submitting review.");
        }
    };


    return (
        <div>
            <header>
                <SearchBar />
            </header>
            <div className="movie-detail-container">
                <div className="left-side">
                    <h2 className="movie-title">{movie.title}</h2>
                    <p>{movie.release_year} • {movie.runtime} min</p>
                    <p>{movie.genre}</p>
                    <img
                        className="movie-poster"
                        src={movie.poster_url}
                        alt={movie.title}
                    />
                </div>
                <div className="right-side">
                    <form onSubmit={handleSubmit}>
                        <BananaMeter value={rating} onChange={setRating} />
                        <textarea
                            className="review-box"
                            name="review"
                            placeholder="Write your review here..."
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                        />
                        <div className="bottom-row">
                            <button type="submit" className="review-button">
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
