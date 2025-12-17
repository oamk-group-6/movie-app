import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./searchBar.css";
import { logout } from './login/logout.jsx';
import colorBanana from '../assets/colorBanana.png';

const API_URL = process.env.REACT_APP_API_URL;

export default function SearchBar() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const isLoggedIn = !!token;
    const avatarSrc = "/default-avatar.png";

    const [query, setQuery] = useState("");
    const [user, setUser] = useState(null);

    // Fetch user info, jos on token
    useEffect(() => {
        if (!token) return;
        fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, [token]);

    // Haku Enterillä
    const handleSearch = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            navigate(`/results?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header className="search-bar-container">
            {/* Logo */}
            <div className="logo">
                <img src={colorBanana} alt="Banana" className="logo-image" />
                <span className="site-name">BRUISEDBANANAS</span>
            </div>

            {/* Navigation + search */}
            <div className="middle-section">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/UserPage">UserPage</Link></li>
                    <li><Link to="/Groups">Groups</Link></li>
                </ul>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="right-section">
                {!isLoggedIn && (
                    <div className="auth-links">
                        <Link className="button" to="/login">Login</Link>
                        <Link to="/register">No account? Sign up</Link>
                    </div>
                )}

                {isLoggedIn && (
                    <div className="part">
                        <p>Hei, {user?.username}</p>
                        <button 
                            type="button" 
                            className="profile-button" 
                            onClick={() => navigate('/UserPage')}
                        >
                            <img 
                                className="profile-pic" 
                                src={user?.avatar_url ? `${API_URL}${user.avatar_url}` : avatarSrc} 
                                alt="Profile" 
                            />
                        </button>
                        <button className="button" onClick={logout}>Log out</button>
                    </div>
                )}
            </div>
        </header>
    );
}
