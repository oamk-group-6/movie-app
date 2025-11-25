import { useState } from "react";

import './DiscoverGroupsSection.css';

const API_URL = process.env.REACT_APP_API_URL;

function authorizedHeader() {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
}

export default function DiscoverGroupsSection({ groups, loggedIn }){
    const [requestStatus, setRequestStatus] = useState({});

    if (!loggedIn) {
        return (
            <div className="discover-groups-section">
                <h2>Discover Groups</h2>
                <p>Log in to discover groups.</p>
            </div>
        );
    }

    const handleJoinRequest = async (groupId) => {
        // prevent double clicking
        if (requestStatus[groupId] === "sent") return;

        setRequestStatus(prev => ({ ...prev, [groupId]: "loading" }));

        try {
            const res = await fetch(`${API_URL}/groups/${groupId}/request-join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authorizedHeader()
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send request");
            }

            setRequestStatus(prev => ({ ...prev, [groupId]: "sent" }));

        } catch (err) {
            console.error(err);
            setRequestStatus(prev => ({ ...prev, [groupId]: "error" }));
        }
    };
    
    return (
        <div className="discover-groups-section">
            <h2>Discover Groups</h2>

            <div className="discover-grid">
                {groups.map(group => (
                    <div className="discover-card" key={group.id}>
                        <img
                            src={`${API_URL}${group.avatar_url}`}
                            alt={`${group.name} Avatar`}
                            className="discover-avatar"
                        />

                        <div className="group-info">
                            <h4>{group.name}</h4>
                            <p>{group.member_count} members</p>

                            <button 
                                className="view-group-btn"
                                onClick={() => handleJoinRequest(group.id)}
                                disabled={requestStatus[group.id] === "sent" || requestStatus[group.id] === "loading"}
                            >
                                {requestStatus[group.id] === "loading" && "Sending..."}
                                {requestStatus[group.id] === "sent" && "Request Sent!"}
                                {!requestStatus[group.id] && "Send Invite"}
                            </button>
                            
                            {requestStatus[group.id] === "error" && (
                                <p className="request-error">Failed to send.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
