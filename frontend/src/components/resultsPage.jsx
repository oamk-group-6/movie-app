import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./searchBar"; 
import "./favMovies.css";

export default function ResultsPageMock() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Batman"); // mock-haku

  useEffect(() => {
    // Luodaan 25 satunnaista mock-elokuvaa
    const mockMovies = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Movie ${i + 1}`,
      release_year: 2000 + Math.floor(Math.random() * 23),
      poster_url: "https://via.placeholder.com/200x300?text=Poster",
      user_rating: Math.random() < 0.7 ? Math.floor(Math.random() * 101) : null, // 70% todennäköisyydellä arvio
      random_bananameter: Math.floor(Math.random() * 31) + 70
    }));

    setMovies(mockMovies);
  }, []);

  return (
    <div className="userpage">
      <header style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", paddingBottom: "1rem" }}>
        <h1>Hakutulokset (mock)</h1>
        <SearchBar onSearch={(query) => console.log("Search:", query)} />
      </header>

      {/* Teksti hausta */}
      <div style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1rem", color: "#fff" }}>
        Showing results for search: "{searchQuery}"
      </div>

      <div className="fav-movies-wrapper">
        <div className="fav-movies-container">
          {movies.map(movie => (
            <Link
              to={`/movies/${movie.id}`}
              key={movie.id}
              className="fav-movie-card"
            >
              <img src={movie.poster_url} alt={movie.title} />
              <h4>{movie.title}</h4>
              <p>{movie.release_year}</p>

              <div className="movie-footer">
                <div className="movie-user-rating">
                  {movie.user_rating != null
                    ? `Your rating: ${movie.user_rating}%`
                    : "You haven't rated this movie yet"}
                </div>

                <div className="movie-average-bar">
                  <div
                    className="movie-average-fill"
                    style={{ width: `${movie.random_bananameter}%` }}
                  />
                  <span className="movie-average-number">
                    Bananameter: {movie.random_bananameter}% 🍌
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
