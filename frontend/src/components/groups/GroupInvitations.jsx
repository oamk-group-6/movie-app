export default function GroupInvitations({ invites, loggedIn }) {
    
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
                    <button className="accept-btn">Accept</button>
                    <button className="decline-btn">Decline</button>
                </div>
            ))}
        </div>
    );
}
