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

  // States
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [ratingMin, setRatingMin] = useState("");
  const [ratingMax, setRatingMax] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [genres, setGenres] = useState([]);
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

  // Funktio, joka fetchaa elokuvat annetuilla URL-parametreilla
  const fetchMovies = async (params) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();

      if (params.get("search")) searchParams.set("search", params.get("search"));
      if (params.get("ratingMin")) searchParams.set("ratingMin", params.get("ratingMin"));
      if (params.get("ratingMax")) searchParams.set("ratingMax", params.get("ratingMax"));
      if (params.get("yearFrom")) searchParams.set("yearFrom", params.get("yearFrom"));
      if (params.get("yearTo")) searchParams.set("yearTo", params.get("yearTo"));
      if (params.get("genres")) searchParams.set("genres", params.get("genres"));
      searchParams.set("limit", 50);

      const res = await fetch(`${API_URL}/movies?${searchParams.toString()}`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 1) Seuraa location.search muutoksia (Enter-haku tai ulkoinen linkki)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("search") || "");
    setRatingMin(params.get("ratingMin") || "");
    setRatingMax(params.get("ratingMax") || "");
    setYearFrom(params.get("yearFrom") || "");
    setYearTo(params.get("yearTo") || "");
    setGenres(params.get("genres")?.split(",") || []);

    fetchMovies(params);
  }, [location.search]);

  // --- 2) Seuraa filterien input-muutoksia ja päivittää URL:n
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (ratingMin) params.set("ratingMin", ratingMin); else params.delete("ratingMin");
    if (ratingMax) params.set("ratingMax", ratingMax); else params.delete("ratingMax");
    if (yearFrom) params.set("yearFrom", yearFrom); else params.delete("yearFrom");
    if (yearTo) params.set("yearTo", yearTo); else params.delete("yearTo");
    if (genres.length) params.set("genres", genres.join(",")); else params.delete("genres");

    // Päivitä URL ilman että historiaan lisätään uusi entry
    navigate(`/results?${params.toString()}`, { replace: true });
  }, [ratingMin, ratingMax, yearFrom, yearTo, genres, navigate]);

  return (
    <>
      <SearchBar />

      <div className="userpage">
        <div style={{ height: "120px" }} />

        {/* Filter dropdown */}
        <div className="filter-dropdown">
          <button onClick={() => setDropdownOpen(prev => !prev)}>
            Select Filters {dropdownOpen ? "▲" : "▼"}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {availableFilters.map(f => (
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
                onChange={e => setRatingMin(e.target.value)}
                min={0}
                max={100}
              />
              <input
                type="number"
                placeholder="Max rating"
                value={ratingMax}
                onChange={e => setRatingMax(e.target.value)}
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
                onChange={e => setYearFrom(e.target.value)}
                min={1970}
                max={2025}
              />
              <input
                type="number"
                placeholder="Year to"
                value={yearTo}
                onChange={e => setYearTo(e.target.value)}
                min={1970}
                max={2025}
              />
            </div>
          )}

          {activeFilters.includes("Genre") && (
            <div className="genre-dropdown">
              <button onClick={() => setGenreDropdownOpen(prev => !prev)}>
                Select Genre {genreDropdownOpen ? "▲" : "▼"}
              </button>
              {genreDropdownOpen && (
                <ul className="dropdown-menu">
                  {allGenres.map(g => (
                    <li key={g} onClick={() => toggleGenre(g)}>
                      {g} {genres.includes(g) && "✔"}
                    </li>
                  ))}
                </ul>
              )}
              {genres.length > 0 && (
                <div className="genre-dropdown-active-genres">
                  {genres.map(g => (
                    <span key={g}>{g}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="results-placeholder">
          {loading && <p>Loading movies...</p>}
          {!loading && movies.length === 0 && <p>No movies found.</p>}
          {!loading && movies.map(movie => (
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
