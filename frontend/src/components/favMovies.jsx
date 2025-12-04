import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserIdFromToken } from "../hooks/useUserIdFromToken";
import "./favMovies.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function FavMovies({ userId, title = "Favourites" }) {
  const internalUserId = useUserIdFromToken();
  const effectiveUserId = userId || internalUserId;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    movieId: null
  });

  useEffect(() => {
    setLoading(true);

    if (!effectiveUserId) {
      setMovies([]);
      setLoading(false);
      return;
    }

    // Hae käyttäjän suosikit backendistä
    fetch(`${API_URL}/favourites/${effectiveUserId}`)
      .then(res => res.json())
      .then(data => {
        const moviesWithBananameter = data.map(movie => ({
          ...movie,
          // Oma arvio backendistä
          user_rating: movie.user_rating ?? null,
          // Satunnainen Bananameter frontendissä
          random_bananameter: Math.floor(Math.random() * 31) + 70
        }));
        setMovies(moviesWithBananameter);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMovies([]);
        setLoading(false);
      });

  }, [effectiveUserId]);

  const unfavourite = async (movieId) => {
    try {
      const res = await fetch(`${API_URL}/favourites/${effectiveUserId}/${movieId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove favourite");

      // Poistetaan kortti frontendistä
      setMovies(prev => prev.filter(m => m.id !== movieId));
      setContextMenu({ visible: false, x: 0, y: 0, movieId: null });
    } catch (err) {
      console.error(err);
    }
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading movies...</p>;
  if (!movies.length) return <p style={{ textAlign: "center" }}>You have no movies on your favourite list.</p>;

  return (
    <div className="fav-movies-wrapper" onClick={handleClick}>
      <h2 className="fav-movies-title">{title}</h2>

      <div className="fav-movies-container">
        {movies.map(movie => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="fav-movie-card"
            onContextMenu={(e) => handleContextMenu(e, movie.id)}
          >
            <img src={movie.poster_url} alt={movie.title} />
            <h4>{movie.title}</h4>
            <p>{movie.release_year}</p>

            <div className="movie-footer">
              {/* Oma arvio */}
              <div className="movie-user-rating">
                {movie.user_rating != null
                  ? `Your rating: ${Math.round(movie.user_rating)}%`
                  : "You haven't rated this movie yet"}
              </div>

              {/* Satunnainen Bananameter */}
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

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="context-menu-item"
            onClick={() => unfavourite(contextMenu.movieId)}
          >
            Unfavourite
          </div>
        </div>
      )}
    </div>
  );
}
