import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./searchBar";
import BananaMeter from "./bananameter";
import "./resultsPage.css";

const API_URL = process.env.REACT_APP_API_URL;

const availableFilters = ["Rating", "Release Year", "Genre"];
const allGenres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller"];

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [query, setQuery] = useState(params.get("search") || "");

  // Filters
  const [activeFilters, setActiveFilters] = useState([]);
  const [ratingMin, setRatingMin] = useState(params.get("ratingMin") || "");
  const [ratingMax, setRatingMax] = useState(params.get("ratingMax") || "");
  const [yearFrom, setYearFrom] = useState(params.get("yearFrom") || "");
  const [yearTo, setYearTo] = useState(params.get("yearTo") || "");
  const [genres, setGenres] = useState(params.get("genres")?.split(",") || []);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setRatingMin("");
    setRatingMax("");
    setYearFrom("");
    setYearTo("");
    setGenres([]);
    setActiveFilters([]);
  };

  const fetchMovies = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams();

    if (query) searchParams.set("search", query);
    if (ratingMin) searchParams.set("ratingMin", ratingMin);
    if (ratingMax) searchParams.set("ratingMax", ratingMax);
    if (yearFrom) searchParams.set("yearFrom", yearFrom);
    if (yearTo) searchParams.set("yearTo", yearTo);
    if (genres.length) searchParams.set("genres", genres.join(","));
    searchParams.set("limit", 50);

    navigate(`/results?${searchParams.toString()}`, { replace: true });

    try {
      const res = await fetch(`${API_URL}/movies?${searchParams.toString()}`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
      setMovies([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [ratingMin, ratingMax, yearFrom, yearTo, genres]);

  return (
    <>
      {/* Navbar */}
      <SearchBar />

      {/* Userpage alkaa navbarin alapuolelta */}
      <div className="userpage">
        {/* Spacer jotta navbar ei peitä filtereitä */}
        <div style={{ height: "120px" }} />

        {/* Select Filters */}
        <div className="filter-dropdown">
          <button onClick={() => setDropdownOpen((prev) => !prev)}>
            Select Filters {dropdownOpen ? "▲" : "▼"}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {availableFilters.map((f) => (
                <li key={f} onClick={() => toggleFilter(f)}>
                  {f} {activeFilters.includes(f) && "✔"}
                </li>
              ))}
            </ul>
          )}
        </div>

        
        <button onClick={clearFilters} style={{ marginLeft: "15px" }}>
          Clear Filters
        </button>

       
        <div className="filters-container">
          {activeFilters.includes("Rating") && (
            <div className="filter-inputs">
              <input
                type="number"
                placeholder="Min rating"
                value={ratingMin}
                onChange={(e) => setRatingMin(e.target.value)}
                min={0}
                max={100}
              />
              <input
                type="number"
                placeholder="Max rating"
                value={ratingMax}
                onChange={(e) => setRatingMax(e.target.value)}
                min={0}
                max={100}
              />
            </div>
          )}

          {activeFilters.includes("Release Year") && (
            <div className="filter-inputs">
              <input
                type="number"
                placeholder="Year from"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                min={1970}
                max={2025}
              />
              <input
                type="number"
                placeholder="Year to"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                min={1970}
                max={2025}
              />
            </div>
          )}

          {activeFilters.includes("Genre") && (
            <div className="genre-dropdown">
              <button onClick={() => setGenreDropdownOpen((prev) => !prev)}>
                Select Genre {genreDropdownOpen ? "▲" : "▼"}
              </button>
              {genreDropdownOpen && (
                <ul className="dropdown-menu">
                  {allGenres.map((g) => (
                    <li key={g} onClick={() => toggleGenre(g)}>
                      {g} {genres.includes(g) && "✔"}
                    </li>
                  ))}
                </ul>
              )}

              {genres.length > 0 && (
                <div className="genre-dropdown-active-genres">
                  {genres.map((g) => (
                    <span key={g}>{g}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        
        <div className="results-placeholder">
          {loading && <p>Loading movies...</p>}
          {!loading && movies.length === 0 && <p>No movies found.</p>}
          {!loading &&
            movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => navigate(`/movies/${movie.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={movie.poster_url} alt={movie.title} />
                <h3>{movie.title}</h3>
                <p>{movie.release_year}</p>
                <div className="movie-footer">
                  {movie.user_rating !== null && (
                    <div className="movie-user-rating">
                      Your rating: {Math.round(movie.user_rating)}%
                    </div>
                  )}
                  <BananaMeter movieId={movie.id} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
