import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./searchBar.css"
import ProfileSidebar from "./profileSidebar";
//import { logout } from './login/logout.jsx';

const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
const avatarSrc = "/default-avatar.png"; // Vaihda tähän käyttäjän profiilikuvan lähde tarvittaessa

export default function SearchBar() {
    const navigate = useNavigate();
    return (
        <div className="search-bar-container">
            <img src="/search-icon.png" alt="Search Icon" style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 8 }} />
            <div className="middle-section">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="UserPage">UserPage</a></li>
                    <li><a href="Groups">Groups</a></li>
                </ul>
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
            <div className="right-section">
                {!isLoggedIn && (
                    <div className="right-section">
                    <a className="button" href="/login">Login</a>
                <a href="/register">No account? Sign up</a>
                </div>
            )}

{isLoggedIn &&(
                <div className="part">
                    <p>Hei user</p>
                    <button type="button" className="profile-button" onClick={() => navigate('/UserPage')}>
 <img src={avatarSrc} alt="Profile"/>
</button>
<button className="button" /*onClick={logout}*/>Log out</button>           

                    </div>
            )}
                </div>

                
        </div>
    );
}
