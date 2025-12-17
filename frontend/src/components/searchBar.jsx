import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./searchBar.css";
import ProfileSidebar from "./profileSidebar";
import { logout } from './login/logout.jsx';
import colorBanana from '../assets/colorBanana.png';

const token = sessionStorage.getItem("token");
const isLoggedIn = !!token;
const avatarSrc = "/default-avatar.png";

export default function SearchBar() {
  const navigate = useNavigate();

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
            <p>Hei user</p>
            <button 
              type="button" 
              className="profile-button" 
              onClick={() => navigate('/UserPage')}
            >
              <img src={avatarSrc} alt="Profile" />
            </button>
            <button className="button" onClick={logout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
