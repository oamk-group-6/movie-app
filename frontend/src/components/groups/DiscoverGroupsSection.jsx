import './DiscoverGroupsSection.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function DiscoverGroupsSection({ groups, loggedIn }){
    
    if (!loggedIn) {
        return (
            <div className="discover-groups-section">
                <h2>Discover Groups</h2>
                <p>Log in to discover groups.</p>
            </div>
        );
    }
    
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

                        <h4>{group.name}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}
