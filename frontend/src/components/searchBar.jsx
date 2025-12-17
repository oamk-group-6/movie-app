import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.css";
import { logout } from './login/logout.jsx';

const token = sessionStorage.getItem("token");
const isLoggedIn = !!token;
const avatarSrc = "/default-avatar.png";

export default function SearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            navigate(`/results?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="search-bar-container">
            <img src="/search-icon.png" alt="Search Icon" style={{ width: 20, height: 20, marginRight: 8 }} />

            <div className="middle-section">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/UserPage">UserPage</a></li>
                    <li><a href="/Groups">Groups</a></li>
                </ul>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch} // Haku Enterillä
                    />
                </div>
            </div>

            <div className="right-section">
                {!isLoggedIn && (
                    <>
                        <a className="button" href="/login">Login</a>
                        <a href="/register">No account? Sign up</a>
                    </>
                )}

                {isLoggedIn && (
                    <div className="part">
                        <p>Hei user</p>
                        <button type="button" className="profile-button" onClick={() => navigate('/UserPage')}>
                            <img src={avatarSrc} alt="Profile"/>
                        </button>
                        <button className="button" onClick={logout}>Log out</button>
                    </div>
                )}
            </div>
        </div>
    );
}
