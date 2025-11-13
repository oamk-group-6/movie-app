import { Link } from 'react-router-dom';
import "./searchBar.css" 

export default function SearchBar() {
    return (
        <div className="search-bar-container">
            <img src="/search-icon.png" alt="Search Icon" style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 8 }} />
            <div className="middle-section">
                <div className="container">
                    <div className="navbar">Nav 1</div>
                    <div className="navbar">Nav 2</div>
                    <div className="navbar">Nav 3</div>
                    <div className="navbar">Nav 4</div>
                    <div className="navbar">Nav 5</div>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
            //Sign in juttu
        </div>
    );
}
