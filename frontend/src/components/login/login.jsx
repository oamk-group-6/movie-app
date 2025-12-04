import React, {useState} from "react";
import "./login.css";
import SearchBar from "../searchBar.jsx";

const API_URL = process.env.REACT_APP_API_URL

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
   
        //Lähetä backendille
        fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        })
        .then(res => res.json())
        .then(data => {
            console.log("Login response:", data);
            if (data.token) {
                localStorage.setItem("token", data.token);
                
                window.location.href = "/";   // siirry etusivulle
            } else {
                setError(data.error || "Invalid email or password");
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            setError("Server error. Try again later.");
        });
    }

    return (
        <div className="login-page">
            <header>
                <SearchBar />
            </header>
            <div className="login-card">
                <h2 className="login-title">Sign in</h2>
                <p>Log in by entering your email address and password.</p>

                <form onSubmit={handleSubmit}>

                    {/* Email label */}
                    <label className="login-label">Email address</label>
                    <div className="input-wrapper">
                        <span className="input-icon"><i className="fa-regular fa-envelope"></i></span>
                        <input
                            type="email"
                            className="login-input"
                            placeholder="email@address.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password label */}
                    <label className="login-label">Password</label>
                    <div className="password-wrapper">
                        <span className="input-icon"><i className="fa-solid fa-lock"></i></span>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="login-input"
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

                    <a className="forgot-password" href="/forgot-password">
                        Forgot password?
                    </a>

                    {/* Login nappi */}
                    <button className="login-btn" type="submit">
                        Log in
                    </button>

                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    <p className="signup-text">
                        Don't have an account? 
                        <a href="/register" className="signup-link">Sign up here</a>
                    </p>
                </form>
            </div>
        
        </div>
    )

}
