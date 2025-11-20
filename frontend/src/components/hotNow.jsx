import { useEffect, useState } from "react";
import "./hotNow.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function HotNow() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/movies?limit=5`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.release_year - a.release_year);
        const withRatings = sorted.map(movie => ({
          ...movie,
          rating_avg: Math.floor(Math.random() * 100) + 1
        }));
        setMovies(withRatings);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      
      <div className="new-releases-wrapper">
        <div className="hot-now-container">
          {movies.map(movie => (
            <div key={movie.external_id} className="hot-movie-card">
              <img src={movie.poster_url} alt="Movie Poster" />
              {/* Bananameter */}
              <div className="movie-average-bar">
                <div
                  className="movie-average-fill"
                  style={{ width: `${movie.rating_avg}%` }}
                />
                <span className="movie-average-number">
                  Bananameter: {movie.rating_avg}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
