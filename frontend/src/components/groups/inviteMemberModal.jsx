import { useState, useEffect } from "react";
import "./inviteMemberModal.css";  

const API_URL = process.env.REACT_APP_API_URL;

export default function InviteMemberModal({ onClose, onInvite, members, ownerId }) {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function authorizedHeader() {
        const token = sessionStorage.getItem("token");
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    }

    //Fetch search suggestions
    useEffect(() => {
        if (locked) return;

        if (value.trim().length < 1) {
            setSuggestions([]);
            return;
        }

        const delay = setTimeout(() => {
            fetch(`${API_URL}/users/search?username=${value}&_=${Date.now()}`, {
                headers: {
                    ...authorizedHeader(),
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Unauthorized");
                    return res.json();
                })
                .then(data => {
                //filter owner and existing members
                const filtered = data.filter(u => {
                    const isOwner = Number(u.id) === Number(ownerId);
                    const isMember = members.some(m => Number(m.id) === Number(u.id));
                    return !isOwner && !isMember;
                });

                setSuggestions(filtered);
                })
                .catch(err => {
                    console.error("FETCH ERROR:", err);
                    setSuggestions([]);
                });
        }, 200);

        return () => clearTimeout(delay);
    }, [value, members, ownerId, locked]);

    const handleSend = () => {
        if (!value.trim()) {
            setError("Please enter a username.");
            return;
        }

        setError("");
        onInvite(value)
            .then(() => {
                setSuccess("Invite sent!");
                setTimeout(() => onClose(), 2000);
            })
            .catch(err => setError(err.message));
    };

    const selectSuggestion = (username) => {
        setLocked(true);
        setValue(username);
        setSuggestions([]);
    };

    return (
        <div className="invite-modal-overlay">
            <div className="invite-modal-box">
                <h3 className="invite-modal-title">Invite Member</h3>

                {/* INPUT + DROPDOWN */}
                <div className="invite-input-section">

                    <input
                        type="text"
                        className="invite-modal-input"
                        placeholder="Username"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value)
                            setLocked(false);
                        }}
                    />

                    {/* AUTO-COMPLETE DROPDOWN */}
                    {suggestions.length > 0 && (
                        <ul className="invite-suggestions-box">
                            {suggestions.map(u => (
                                <li
                                    key={u.id}
                                    className="invite-suggestion-item"
                                    onClick={() => selectSuggestion(u.username)}
                                >
                                    {u.username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {error && <p className="invite-modal-error">{error}</p>}
                {success && <p className="invite-modal-success">{success}</p>}

                <div className="invite-modal-buttons">
                    <button className="invite-modal-btn cancel" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="invite-modal-btn send" onClick={handleSend}>
                        Send Invite
                    </button>
                </div>
            </div>
        </div>
    );
}
