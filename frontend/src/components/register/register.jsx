import React, {useState} from "react";
import "./register.css";
import SearchBar from "../searchBar.jsx";

const API_URL = process.env.REACT_APP_API_URL

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        //Lähetä backendille
        fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username ,email, password}),
        })
        .then(async (res) => {
            console.log("STATUS:", res.status);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            // Rekisteröinti onnistui
            console.log("Register response:", data);
            window.location.href = "/login";
        })
        .catch(err => {
            console.error("Register error:", err);
            setError("Server error. Try again later.");
        });
    }

    return (
        <div className="register-page">
            <header>
                <SearchBar />
            </header>

            <div className="register-card">
                <h2 className="register-title">Create Your Account</h2>
                
                <form onSubmit={handleSubmit}>

                    {/* Username label */}
                    <label className="register-label">Username</label>
                    <div className="input-wrapper">
                        <span className="input-icon"><i className="fa-solid fa-user"></i></span>
                        <input
                            type="text"
                            className="register-input"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email label */}
                    <label className="register-label">Email address</label>
                    <div className="input-wrapper">
                        <span className="input-icon"><i className="fa-regular fa-envelope"></i></span>
                        <input
                            type="email"
                            className="register-input"
                            placeholder="email@address.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password label */}
                    <label className="register-label">Password</label>
                    <div className="password-wrapper">
                        <span className="input-icon"><i className="fa-solid fa-lock"></i></span>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="register-input"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-eye"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <i className="fa-solid fa-eye-slash"></i>) : (<i className="fa-regular fa-eye"></i>)}
                        </span>
                    </div>

                    
                    {/* Create account nappi */}
                    <button className="register-btn" type="submit">
                        Create Account
                    </button>

                    <p className="login-text">
                        Already have an account? 
                        <a href="/login" className="login-link">Log in here</a>
                    </p>
                </form>
            </div>
        
        </div>
    )

}
