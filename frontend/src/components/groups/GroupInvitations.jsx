import "./groupInvitations.css";

const API_URL = process.env.REACT_APP_API_URL;

function authorizedHeader() {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
}

export default function GroupInvitations({ invites, setInvites,loggedIn, refreshMyGroups }) {

    const handleAccept = (inviteId) => {
        fetch(`${API_URL}/groups/invitations/${inviteId}/accept`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authorizedHeader()
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to accept invitation");
                return res.json();
            })
            .then(() => {
                // Remove invite from UI
                setInvites(prev => prev.filter(inv => inv.id !== inviteId));
                refreshMyGroups();
            })
            .catch(err => console.error(err));
    };

    const handleDecline = (inviteId) => {
        fetch(`${API_URL}/groups/invitations/${inviteId}/decline`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authorizedHeader()
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to decline invitation");
                return res.json();
            })
            .then(() => {
                setInvites(prev => prev.filter(inv => inv.id !== inviteId));
            })
            .catch(err => console.error(err));
    };
    
    if (!loggedIn) {
        return (
            <div className="group-invitations-section">
                <h2>Group Invitations</h2>
                <p>Log in to view invitations.</p>
            </div>
        );
    }

    return (
        <div className="group-invitations-section">
            <h2>Group Invitations</h2>

            {(!invites || invites.length === 0) && (
                <p>No invitations at the moment.</p>
            )}

            {invites && invites.map(invite => (
                <div key={invite.id} className="invitation-card">
                    <p>You have been invited to join: <strong>{invite.group_name}</strong></p>
                    <button 
                        className="accept-btn"
                        onClick={() => handleAccept(invite.id)}    
                    >Accept</button>
                    <button 
                        className="decline-btn"
                        onClick={() => handleDecline(invite.id)}    
                    >Decline</button>
                </div>
            ))}
        </div>
    );
}
