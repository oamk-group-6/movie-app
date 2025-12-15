import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./searchBar.jsx";
import Reviews from "./reviews.jsx";
import BananaMeter from "./bananameter.jsx"
import { useUserIdFromToken } from "../hooks/useUserIdFromToken";
import "./movieDetail.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function MovieDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);

    const [userGroups, setUserGroups] = useState([]);
    const [groupFavouriteStatus, setGroupFavouriteStatus] = useState({})
    const [showFavouriteMenu, setShowFavouriteMenu] = useState(false);

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

    // Hae käyttäjän ryhmät suosikkeihin lisäämistä varten
    useEffect(() => {
        if (!userId) return;

        fetch(`${API_URL}/groups/my/all`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setUserGroups(data))
            .catch(err => console.error("Failed to fetch groups:", err));
    }, [userId]);

    //Hae käyttäjän ryhmien suosikki-status tälle elokuvalle
    useEffect(() => {
        if (!userGroups.length) return;

        const fetchStatuses = async () => {
            const newStatus = {};

            for (const group of userGroups) {
                try {
                    const res = await fetch(`${API_URL}/groupfavourites/group/${group.id}/${id}`);
                    const data = await res.json();
                    newStatus[group.id] = data.isFavourite;
                } catch (err) {
                    console.error("Failed to fetch group favourite status:", err);
                }
            }

            setGroupFavouriteStatus(newStatus);
        };

        fetchStatuses();
    }, [userGroups, id]);

    // Lisää omiin suosikkeihin
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

    // Lisää ryhmän suosikkeihin
    const toggleGroupFavourite = async (groupId) => {
        const fav = groupFavouriteStatus[groupId];

        try {
            if (fav) {
                // REMOVE
                await fetch(`${API_URL}/groupfavourites/group/${groupId}/${id}`, {
                    method: "DELETE"
                });
            } else {
                // ADD
                await fetch(`${API_URL}/groupfavourites/group/${groupId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        movieId: parseInt(id),
                        userId
                    })
                });
            }
            setGroupFavouriteStatus(prev => ({
                ...prev,
                [groupId]: !fav
            }));

            setShowFavouriteMenu(false);
        } catch (err) {
            console.error("Failed to add group favourite:", err);
        }
    };

    if (!movie) return <p>Loading...</p>;

    return (
        <div className="movie-detail-page">
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
    onClick={() => {
        if (userGroups.length === 0) {
            toggleFavourite();
        } else {
            setShowFavouriteMenu(true);
        }
    }}
    title={isFavourite ? "Remove from favourites" : "Add to favourites"}
>
    🍌
</button>

    {/* FAVOURITE MENU */}
    {showFavouriteMenu && (
        <div className="favourite-menu">
            <div
                className="menu-item"
                onClick={() => toggleFavourite()}
            >
                <i className={`menu-star fa-star ${isFavourite ? "fa-solid favourite" : "fa-regular not-favourite"}`}></i>
                {isFavourite ? "Remove from my favourites" : "Add to my favourites"}
            </div>

            {userGroups.map(group => {
                const fav = groupFavouriteStatus[group.id];

                return (
                    <div
                        key={group.id}
                        className="menu-item"
                        onClick={() => toggleGroupFavourite(group.id)}
                    >
                        <i
                            className={`menu-star fa-star ${
                                fav ? "fa-solid favourite" : "fa-regular not-favourite"
                            }`}
                        ></i>

                        {fav
                            ? `Remove from group: ${group.name}`
                            : `Add to group: ${group.name}`}
                    </div>
                );
            })}


            <button
                className="menu-close"
                onClick={() => setShowFavouriteMenu(false)}
            >
                Close
            </button>
        </div>
    )}

</div>
    <BananaMeter movieId={id}/>

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
