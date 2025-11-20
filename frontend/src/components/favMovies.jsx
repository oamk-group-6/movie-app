import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import "./favMovies.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function FavMovies({ userId, title = "Favourites" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, movieId: null });

  useEffect(() => {
    setLoading(true);

    if (!userId) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const fetchUrl = `${API_URL}/movies?limit=15&sort=release_year_desc`;

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        const withRatings = data.map(movie => ({
          ...movie,
          user_rating: Math.floor(Math.random() * 11) + 90,
          rating_avg: Math.floor(Math.random() * 31) + 70
        }));
        setMovies(withRatings);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMovies([]);
        setLoading(false);
      });

  }, [userId]);

  const unfavourite = (movieId) => {
    setMovies(prev => prev.filter(m => m.external_id !== movieId));
    setContextMenu({ visible: false, x: 0, y: 0, movieId: null });
    console.log("Unfavourited movie ID:", movieId);
  };

  const handleContextMenu = (e, movieId) => {
    e.preventDefault();

    const offsetX = 10;
    const offsetY = 0;

    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;

    const menuWidth = 150;
    const menuHeight = 40;

    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 5;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 5;

    setContextMenu({ visible: true, x, y, movieId });
  };

  const handleClick = () => {
    if (contextMenu.visible) {
      setContextMenu({ visible: false, x: 0, y: 0, movieId: null });
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Ladataan elokuvia...</p>;
  if (!movies.length) return <p style={{ textAlign: "center" }}>Ei elokuvia näytettävänä.</p>;

  return (
    <div className="fav-movies-wrapper" onClick={handleClick}>
      {/* Favourites-otsikko */}
      <h2 className="fav-movies-title">{title}</h2>

      <div className="fav-movies-container">
        {movies.map(movie => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="fav-movie-card"
            onContextMenu={(e) => handleContextMenu(e, movie.external_id)}
          >
            <img src={movie.poster_url} alt={movie.title} />
            <h4>{movie.title}</h4>
            <p>{movie.release_year}</p>

            {/* Alaosa: käyttäjän oma arvosana + Bananameter */}
            <div className="movie-footer">
              {movie.user_rating !== undefined && movie.user_rating !== null && (
                <div className="movie-user-rating">
                  Your rating: {Math.round(movie.user_rating)}%
                </div>
              )}
              {movie.rating_avg !== undefined && movie.rating_avg !== null && (
                <div className="movie-average-bar">
                  <div
                    className="movie-average-fill"
                    style={{ width: `${movie.rating_avg}%` }}
                  />
                  <span className="movie-average-number">
                    Bananameter: {Math.round(movie.rating_avg)}% 🍌
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="context-menu-item" onClick={() => unfavourite(contextMenu.movieId)}>
            Unfavourite
          </div>
        </div>
      )}
    </div>
  );
}
