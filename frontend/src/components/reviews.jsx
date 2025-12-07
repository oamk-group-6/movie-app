import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "./reviews.css";


const API_URL = process.env.REACT_APP_API_URL

export default function Reviews() {
    const { id } = useParams();

    const [ratings, setRatings] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const limit = 5;

    useEffect(() => {
        setRatings([]);
        setPage(1);
        setHasMore(true);

        fetch(`${API_URL}/ratings/movie/${id}?page=1&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) return;
                setRatings(data.ratings);
                setTotalCount(data.totalCount);
                setHasMore(1 < data.totalPages);
            })
            .catch(err => console.error(err));
    }, [id]);

    const showMore = () => {
        const nextPage = page + 1;
        fetch(`${API_URL}/ratings/movie/${id}?page=${nextPage}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) return;
                setRatings(prev => [...prev, ...data.ratings]);
                setPage(nextPage);
                setHasMore(nextPage < data.totalPages);
            })
            .catch(err => console.error(err));
    };


    return (
        <div>
            <h3>Reviews ({totalCount})</h3>

            {ratings.length === 0 ? (
                <p>No reviews for this movie.</p>
            ) : (
                ratings.map((r, index) => (
                    <div key={index} className="rating-box">
                        <p><strong>{r.username}</strong> — {new Date(r.created_at).toLocaleDateString()}</p>

                        <div className="movie-bar">
                            <div
                                className="movie-fill"
                                style={{ width: `${r.rating}%` }}
                            />
                            <span className="movie-number">
                                {r.rating}% 🍌
                            </span>
                        </div>

                        <div className="review-text">
                            {r.review}
                        </div>

                        <hr />
                    </div>
                ))
            )}

            {hasMore && (
                <button onClick={showMore}>
                    Show more
                </button>
            )}
        </div>

    );
}