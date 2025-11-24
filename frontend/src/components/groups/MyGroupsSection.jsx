import { useNavigate } from "react-router-dom";
import "./MyGroupsSection.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function MyGroupsSection({ groups, loggedIn }) {
    const navigate = useNavigate();

    if (!loggedIn) {
        return (
            <div className="my-groups-section">
                <h2>My Groups</h2>
                <p>Log in to see your groups.</p>
            </div>
        );
    }

    return (
        <div className="my-groups-section">
            <h2>My Groups</h2>

            {groups.length === 0 && (
                <p>You are not a member of any groups yet.</p>
            )}

            {groups.map(group => (
                <div className="my-group-card" key={group.id}>
                    <img
                        src={`${API_URL}${group.avatar_url}`}
                        alt={`${group.name} Avatar`}
                        className="groups-avatar"
                    />

                    <div className="group-info">
                        <h4>{group.name}</h4>
                        <p>{group.member_count} members</p>

                        <button 
                            className="view-group-btn"
                            onClick={() => navigate(`/groups/${group.id}`)}
                        >View Group</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
