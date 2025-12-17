import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./searchBar.css";
import ProfileSidebar from "./profileSidebar";
import { logout } from './login/logout.jsx';
import { useEffect, useState } from 'react';
import colorBanana from '../assets/colorBanana.png';

const API_URL = process.env.REACT_APP_API_URL;

export default function SearchBar() {
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const isLoggedIn = !!token;
    const avatarSrc = "/default-avatar.png"; // Vaihda tähän käyttäjän profiilikuvan lähde tarvittaessa


    const [user, setUser] = useState(null);

    useEffect(() => {
        if(!token) return;

        fetch(`${API_URL}/users/me`, { headers: {Authorization: `Bearer ${token}`} })
            .then(res => res.json())
            .then(data => {
                setUser(data)
            })

    }, [token]);

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
          <input type="text" placeholder="Search..." />
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
              <img className="profile-pic" src={`${API_URL}${user?.avatar_url}` || {avatarSrc}} alt="Profile" />
            </button>
            <button className="button" onClick={logout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
