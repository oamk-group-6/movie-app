import { useState } from "react";
import FavMovies from "./favMovies";
import SearchBar from "./searchBar";
import ProfileSidebar from "./profileSidebar";
import "./userPage.css";

export default function UserPage() {
  const [userId, setUserId] = useState(null); // oikea käyttäjä tai null
  const [showMockUser, setShowMockUser] = useState(false); // nappi dev-mock

  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  // effectiveUserId välittää tiedon sekä Sidebarille että FavMoviesille
  const effectiveUserId = userId || (isDev && showMockUser ? 1 : null);

  return (
    <div className="userpage">
      <header style={{ maxWidth: 600, margin: "0 auto 2rem auto", textAlign: "center" }}>
        <h1>Jotain</h1>
        <SearchBar />
      </header>

      <div className="userpage-content">

        {/* Sidebar näkyy vain jos effectiveUserId on olemassa */}
        {effectiveUserId && <ProfileSidebar userId={effectiveUserId} />}

        <main className="main-content">
          <div className="userpage-header">
            <button onClick={() => setShowMockUser(prev => !prev)}>
              {showMockUser ? "Näytä ei-kirjautunut" : "Näytä mock-käyttäjä"}
            </button>
          </div>

          {effectiveUserId ? (
            <section>
              <FavMovies userId={effectiveUserId} limit={5} title="Your Favourite Movies" />
            </section>
          ) : (
            <p style={{ textAlign: "center" }}>Kirjaudu nähdäksesi suosikkielokuvat</p>
          )}
        </main>
      </div>
    </div>
  );
}
