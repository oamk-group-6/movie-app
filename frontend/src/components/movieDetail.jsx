import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./searchBar.jsx";
import Reviews from "./reviews.jsx";
import { useUserIdFromToken } from "../hooks/useUserIdFromToken";
import "./movieDetail.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function MovieDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);

    const userId = useUserIdFromToken();

    // Hae elokuva
    useEffect(() => {
        fetch(`${API_URL}/movies/${id}`)
            .then(res => res.json())
            .then(data => setMovie(data))
            .catch(err => console.error(err));
    }, [id]);

    // Hae käyttäjän suosikit ja tarkista onko tämä elokuva siellä
    useEffect(() => {
        if (!userId) return;

        fetch(`${API_URL}/favourites/${userId}`)
            .then(res => res.json())
            .then(favourites => {
                setIsFavourite(favourites.some(f => f.id === parseInt(id)));
            })
            .catch(err => console.error(err));
    }, [id, userId]);

    // Favourite-napin toiminto
    const toggleFavourite = async () => {
        if (!userId) return;

        try {
            if (isFavourite) {
                await fetch(`${API_URL}/favourites/${userId}/${id}`, {
                    method: "DELETE"
                });
                setIsFavourite(false);
            } else {
                await fetch(`${API_URL}/favourites`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, movieId: parseInt(id) })
                });
                setIsFavourite(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!movie) return <p>Loading...</p>;

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

                    <div className="poster-container">
    <img
        className="movie-poster"
        src={movie.poster_url}
        alt={movie.title}
    />
    <button
    type="button"
    className={`favourite-button ${isFavourite ? "favourited" : ""}`}
    onClick={toggleFavourite}
    title={isFavourite ? "Remove from favourites" : "Add to favourites"}
>
    🍌
</button>

</div>

                </div>

                <div className="right-side">
                    <p className="movie-description">{movie.description}</p>
                    <div className="bottom-row">
                        <button
                            type="button"
                            className="review-button"
                            onClick={() => navigate(`/movies/${id}/review`)}
                        >
                            Review this movie
                        </button>
                    </div>
                    <div>
                        <Reviews />
                    </div>
                </div>
            </div>

        </div>
    );
}
