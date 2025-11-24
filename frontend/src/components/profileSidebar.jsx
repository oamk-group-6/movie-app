import { useEffect, useState } from "react";
import "./profileSidebar.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function ProfileSidebar({ userId }) {
  if (!userId) return null;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [profile, setProfile] = useState({
    username: "",
    realName: "",
    email: "",
    bio: "",
    avatar_url: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      if (!userId) {
        setProfile(prev => ({
          ...prev,
          username: "mockuser",
          realName: "John Doe",
          email: "mock@example.com",
          bio: "This is my bio",
          avatar_url: ""
        }));
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/users/${userId}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setProfile({
          username: data.username || "",
          realName: data.real_name || data.realName || data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || data.avatarUrl || ""
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        username: profile.username,
        email: profile.email,
        bio: profile.bio,
        real_name: profile.realName
      };

      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setProfile(prev => ({
        ...prev,
        username: updated.username || payload.username,
        realName: updated.real_name || updated.realName || payload.real_name,
        email: updated.email || payload.email,
        bio: updated.bio || payload.bio
      }));
      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSavePicture = async () => {
    if (!selectedFile) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res = await fetch(`${API_URL}/users/${userId}/avatar`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setProfile(prev => ({
        ...prev,
        avatar_url: data.avatar_url || data.avatarUrl || prev.avatar_url
      }));
      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setMessage("Profile picture saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to upload image.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const avatarSrc = previewUrl || profile.avatar_url || "https://via.placeholder.com/150";

  return (
    <aside className="profile-sidebar">
      <h2>Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="profile-picture-section">
            <img src={avatarSrc} alt="Profile" className="profile-picture" />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                className="save-btn"
                onClick={handleSavePicture}
                disabled={!selectedFile || saving}
              >
                {saving ? "Saving..." : "Save Picture"}
              </button>

              <button
                className="save-btn"
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                disabled={!selectedFile || saving}
              >
                Cancel
              </button>
            </div>
          </div>

          <label>Username</label>
          <input
            name="username"
            placeholder="Username"
            value={profile.username}
            onChange={handleChange}
          />

          <label>Full Name</label>
          <input
            name="realName"
            placeholder="Full Name"
            value={profile.realName}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            placeholder="Short bio"
            value={profile.bio}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
            <button
              className="save-btn"
              onClick={() => {
                if (userId) {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 200);
                } else {
                  setProfile({
                    username: "mockuser",
                    realName: "John Doe",
                    email: "mock@example.com",
                    bio: "This is my bio",
                    avatar_url: ""
                  });
                }
              }}
            >
              Cancel Changes
            </button>
          </div>

          {message && <p className="info-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </>
      )}
    </aside>
  );
}
