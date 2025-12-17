import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import BananaMeter from "./bananameter.jsx"
import "./newReleases.css"

const API_URL = process.env.REACT_APP_API_URL;

export default function NewReleases() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/movies/now-playing`)
      .then(res => res.json())
      .then(data => {
        setMovies(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <div className="new-releases-container">
        {movies.map(movie => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="movie-card"
          >
            <img src={movie.poster_url} alt="Movie Poster" />

            <BananaMeter movieId={movie.id}/>
          </Link>
        ))}
      </div>
    </div>
  );
}
