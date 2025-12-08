import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar";
import InviteMemberModal from "./inviteMemberModal";

import "./groupDetail.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function GroupDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("")
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [groupFavourites, setGroupFavourites] = useState([]);


    function getUserIdFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.userId;
        } catch {
            return null;
        }
    }

    const userId = getUserIdFromToken();

    function authorizedHeader() {
        const token = localStorage.getItem("token");
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    }

    useEffect(() => {

        // Fetch group details
        fetch(`${API_URL}/groups/${id}`, { headers: authorizedHeader() })
            .then(res => res.json())
            .then(data => {
                setGroup(data);
                if (data.owner_id === userId) {
                    setIsOwner(true);
                }
        });

        // Fetch group members
        fetch(`${API_URL}/groups/${id}/members`, { headers: authorizedHeader() })
            .then(res => res.json())
            .then(data => setMembers(data));

        // Fetch group comments
        fetch(`${API_URL}/groupcomments/group/${id}`, { headers: authorizedHeader() })
            .then(res => res.json())
           .then(data => setComments(data));

        // Fetch group favourites
        fetch(`${API_URL}/groupfavourites/group/${id}`, { headers: authorizedHeader() })
            .then(res => res.json())
            .then(data => setGroupFavourites(data))
            .catch(err => console.error("Failed to load group favourites:", err));


    }, [id, userId]);

    // Fetch join requests if user is owner
    useEffect(() => {
        if (!isOwner) return; 

        fetch(`${API_URL}/groups/${id}/join-requests`, { headers: authorizedHeader() })
            .then(res => res.json())
            .then(data => setJoinRequests(data))
            .catch(err => console.error("Join request error:", err));

    }, [isOwner, id]);

    //Leave group for non-owners
    const handleLeaveGroup = () => {
        const confirmDelete = window.confirm("Are you sure you want to leave this group?");
        if (!confirmDelete) return;

        fetch(`${API_URL}/groups/${id}/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            ...authorizedHeader()
        }
        })
            .then(res => {
                if (res.ok) navigate("/groups");
            });
    };

    //Delete group for owners
    const handleDeleteGroup = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this group?");
        if (!confirmDelete) return;

        fetch(`${API_URL}/groups/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            ...authorizedHeader()
            }
        })
            .then(res => {
                if (res.ok) navigate("/groups");
        });
    };

    //Remove member for owners
    const handleRemoveMember = (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this member?");
        if (!confirmDelete) return;

        fetch(`${API_URL}/groups/${id}/members/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...authorizedHeader()
            }
        })
            .then(res => res.json())
            .then(() => {
                // delete member from display without refresh
                setMembers(prev => prev.filter(m => m.id !== userId));
            })
            .catch(err => console.error("Remove member error:", err));
    };

    // Invite member for owners
    const sendInvite = async (username) => {
        const res = await fetch(`${API_URL}/groups/${id}/invite-member`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authorizedHeader()
            },
            body: JSON.stringify({ username })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to send invite.");
        }

        return true;
    };

    // ACCEPT JOIN REQUEST
    const handleAcceptJoin = (requestId, requestUserId, username) => {
        fetch(`${API_URL}/groups/${id}/join-requests/${requestId}/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authorizedHeader() }
        })
            .then(res => res.json())
            .then(() => {
                // Add user to members list
                setMembers(prev => [
                    ...prev,
                    {
                        id: requestUserId,
                        username: username,
                        role: "member"
                    }
                ]);

                // Remove request from UI
                setJoinRequests(prev => prev.filter(r => r.id !== requestId));
            });
    };

    // DECLINE JOIN REQUEST
    const handleDeclineJoin = (requestId) => {
        fetch(`${API_URL}/groups/${id}/join-requests/${requestId}/decline`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authorizedHeader() }
        })
            .then(() =>
                setJoinRequests(prev => prev.filter(r => r.id !== requestId))
            );
    };

    //add comments handler
    const handleAddComment = () => {
        if(!newComment.trim()) return;

        const body = {
            user_id: userId,
            group_id: Number(id),
            content: newComment
        }

        fetch(`${API_URL}/groupcomments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authorizedHeader()
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(added => {
            setComments(prev => [...prev, added]);
            setNewComment("");
        })
        .catch(err => console.error("Comment error:", err));
    };

    const handleDeleteGroupFavourite = (movieId) => {
        const confirmDelete = window.confirm("Remove this movie from group favourites?");
        if (!confirmDelete) return;

        fetch(`${API_URL}/groupfavourites/group/${id}/${movieId}`, {
            method: "DELETE",
            headers: authorizedHeader()
        })
        .then(res => {
        if (res.ok) {
            // Poista kortti UI:sta
            setGroupFavourites(prev =>
                prev.filter(movie => movie.id !== movieId)
            );
        }
        });
    };


    if(!group) {
        return <p>Loading group...</p>;
    }

    return (
        <div className="group-details-page">
            <header>
                <SearchBar />
            </header>
            <div className="group-details-header">
                <i
                    className="fa-solid fa-arrow-left"
                    onClick={() => navigate(-1)}
                />
            </div>
            
            <div className="group-details-content">    
                {/* LEFT COLUMN */}
                <div className="group-left">
                    <h2>{group.name}</h2>

                    <img 
                    src={`${API_URL}${group.avatar_url}`} 
                    alt="Group Avatar" 
                    className="group-avatar"
                    />
                    <p>Description: {group.description}</p>

                    <div className="members-header">
                        <h3>Members</h3>

                        {isOwner && (
                            <button 
                                className="invite-member-btn"
                                onClick={()=>setShowInviteModal(true)}
                            >Invite member</button>
                        )}
                    </div>


                    <ul className="member-list">
                        {members.map(m => (
                        <li key={m.id}>
                            {m.username} {m.role === "owner" && "(owner)"}
                            
                            {isOwner && m.id !== group.owner_id && (
                                <button 
                                    className="remove-member-btn"
                                    onClick={() => handleRemoveMember(m.id)}
                                ><i className="fa-solid fa-x"></i></button>
                            )}
                        </li>
                        ))}
                    </ul>

                    {isOwner && (
                        <div>
                            <h3>Join Requests</h3>

                            <ul className="invite-list">
                                {joinRequests.length === 0 && <p>No pending requests.</p>}

                                {joinRequests.map(req => (
                                    <li key={req.id}>
                                        {req.username}

                                        <div className="accept-buttons">
                                            <button className="accept-member-btn"
                                                onClick={() => handleAcceptJoin(req.id, req.user_id, req.username)}
                                            >
                                                <i className="fa-solid fa-check" />
                                            </button>

                                            <button className="decline-member-btn"
                                                onClick={() => handleDeclineJoin(req.id)}
                                            >
                                                <i className="fa-solid fa-x" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    
                    {!isOwner && (
                        <button className="leave-group-btn" onClick={handleLeaveGroup}>
                        Leave Group
                        </button>
                    )}

                    {isOwner && (
                        <button className="delete-group-btn" onClick={handleDeleteGroup}>
                        Delete Group
                        </button>
                    )}
                </div>

                {/* CENTER COLUMN: Favourites */}
                <div className="group-center">
                    <h2>Our favourites</h2>

                    <div className="group-favourites-grid">
                        {groupFavourites.length === 0 ? (
                            <p>No favourites yet.</p>
                        ) : (
                            groupFavourites.map(movie => (
                                <div
                                    key={movie.id}
                                    className="group-favourite-movie-card"
                                    onClick={() => navigate(`/movies/${movie.id}`)}
                                >
                                    <img src={movie.poster_url} alt={movie.title} />
                                    <div className="title-and-button">
                                        <p>{movie.title}</p>
                                    
                                        <button 
                                            className="delete-group-favourite-btn"
                                            onClick={(e) => {
                                                e.stopPropagation(); // estää kortin klikkauksen navigoinnin
                                                handleDeleteGroupFavourite(movie.id);
                                            }}
                                        >
                                            <i className="fa-solid fa-x" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}    
                    </div>
                </div>

                {/* RIGHT COLUMN: Comments */}
                <div className="group-right">
                    <h2>Comments</h2>

                    <div className="comments-box">
                        {comments.length === 0 ? (
                            <p>No comments yet.</p>
                        ) : (
                            comments.map((c, index) => (
                                <p key={index}>
                                    <strong>{c.username}:</strong> {c.content}
                                </p>
                            ))
                        )}
                    </div>
                    <div className="add-comments">
                        <textarea 
                            className="comment-input"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write a comment...(max 75 characters)"
                            maxLength={75}
                        ></textarea>
                        <button
                            className="comment-btn"
                            onClick={handleAddComment}
                        >Add comment</button>
                    </div>
                </div>
            </div>
            {/* MODAL RENDERING */}
            {showInviteModal && (
                <InviteMemberModal
                    onClose={() => setShowInviteModal(false)}
                    onInvite={sendInvite}
                    members={members || []}
                    ownerId={group.owner_id}
                />
            )}    
        </div>
    );
}