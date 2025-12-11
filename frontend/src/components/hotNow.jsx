import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

import BananaMeter from "./bananameter.jsx"
import "./hotNow.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function HotNow() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/movies?limit=5`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.release_year - a.release_year);
        setMovies(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>

      <div className="new-releases-wrapper">
        <div className="hot-now-container">
          {movies.map(movie => (
            <Link
              to={`/movies/${movie.id}`}
              key={movie.id}
              className="hot-movie-card"
            >
              <img src={movie.poster_url} alt="Movie Poster" />
              <BananaMeter movieId={movie.id} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
