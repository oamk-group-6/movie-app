import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MyGroupsSection from "./MyGroupsSection";
import DiscoverGroupsSection from "./DiscoverGroupsSection";
import GroupInvitations from "./GroupInvitations";
import SearchBar from "../searchBar";

import "./groupsPage.css";

const API_URL = process.env.REACT_APP_API_URL

export default function GroupsPage() {
  const [myGroups, setMyGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [invites, setInvites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchMyGroups();
    fetchDiscoverGroups();
    fetchInvitations();
  }, [isLoggedIn]);

  function fetchMyGroups() {
    fetch(`${API_URL}/groups/my/all`, { headers: authorizedHeader() })
      .then(res => res.json())
      .then(data => setMyGroups(data));
  }

  function fetchDiscoverGroups() {
    fetch(`${API_URL}/groups/discover/all`, { headers: authorizedHeader() })
      .then(res => res.json())
      .then(data => setDiscoverGroups(data));
  }

  function fetchInvitations() {
    fetch(`${API_URL}/groups/invitations/all`, { headers: authorizedHeader() })
      .then(res => res.json())
      .then(data => setInvites(data));
  }

  //Filter discover groups by search
  const filteredDiscover = discoverGroups.filter(g =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
    
  return (

    <div className="groups-page">
        <header>
            <SearchBar />
        </header>

        <div className="groups-header">
            <input 
                className="group-search-input"
                placeholder="Discover groups by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoggedIn &&(
              <button 
                className="create-new-group-btn"
                onClick={() => navigate("/groups/create")}
              >
                  <span className="btn-icon"><i className="fa-solid fa-plus"></i></span>
                  Create New Group
              </button>
            )}
        </div>

      <div className="groups-content">

        {/* Left column – My Groups */}
        <div className="groups-left">
          <MyGroupsSection 
            groups={isLoggedIn ? myGroups : null}
            loggedIn={isLoggedIn}
          />
        </div>

        {/* Center column – Discover Groups*/}
        <div className="groups-center">
          <DiscoverGroupsSection 
            groups={isLoggedIn ? filteredDiscover : null}
            loggedIn={isLoggedIn}
            refreshDiscoverGroups={fetchDiscoverGroups}
          />
        </div>

        {/* Right column – Invitations */}
        <div className="groups-right">
          <GroupInvitations 
            invites={isLoggedIn ? invites : []}
            setInvites={setInvites}
            loggedIn={isLoggedIn}
            refreshMyGroups={fetchMyGroups}
            refreshDiscoverGroups={fetchDiscoverGroups}
            refreshInvitations={fetchInvitations}
          />
        </div>
      </div>
    </div>
  );
}

function authorizedHeader() {
  const token = sessionStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
