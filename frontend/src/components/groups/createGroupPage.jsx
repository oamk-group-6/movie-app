import {useState} from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function CreateGroupPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [avatar, setAvatar] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function authorizedHeader() {
        const token = localStorage.getItem("token");
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    }

    const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
        setError("Group name is required.");
        return;
    }

    fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authorizedHeader(),
      },
      body: JSON.stringify({
        name,
        description,
        avatar_url: avatar,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create group.");
        return res.json();
      })
      .then((data) => {
        setSuccess("Group created successfully!");
        setTimeout(() => {
          navigate("/groups");
        }, 800);
      })
      .catch((err) => {
        setError("Error creating group.");
        console.error(err);
      });
  };


    return (
        <div>
            <h2>Create a New Group</h2>
            
            <form onSubmit={handleSubmit} className="create-group-form">
        
                <label>Group Name</label>
                <input
                    type="text"
                    className="group-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Description</label>
                <textarea
                    className="group-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <label>Avatar URL</label>
                <input
                    type="text"
                    className="group-input"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                />

                <button type="submit" className="create-group-btn">
                    Create Group
                </button>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
}
