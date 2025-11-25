import {useState} from "react";
import { useNavigate } from "react-router-dom";

import "./createGroupPage.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function CreateGroupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");

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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        ...authorizedHeader(),
      },
      body: formData,
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

                <label>Avatar</label>
                <input
                    type="file"
                    accept="image/*"
                    className="group-input"
                    onChange={(e) => setAvatar(e.target.files[0])}
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
