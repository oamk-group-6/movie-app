import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./searchBar.jsx";

import "./movieDetail.css"

const API_URL = process.env.REACT_APP_API_URL

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/movies/${id}`)
            .then(res => res.json())
            .then(data => setMovie(data));
    }, [id]);

    if (!movie) return <p>Loading...</p>;
    console.log(movie.release_year, movie.genre, movie.runtime);


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
                    <p className="movie-description">{movie.description}</p>
                    <div className="bottom-row">
                        
                        <button type="button" className="review-button">
                            Review this movie
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
