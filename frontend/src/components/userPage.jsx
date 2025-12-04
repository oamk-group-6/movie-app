
import { useState, useEffect } from "react";
import FavMovies from "./favMovies";
import SearchBar from "./searchBar";
import ProfileSidebar from "./profileSidebar";
import "./userPage.css";

export default function UserPage() {
  const [userId, setUserId] = useState(null); // kirjautuneen käyttäjän ID
  const [showUserView, setShowUserView] = useState(true); // ohjaa näkymän vaihtoa

  // Haetaan userId localStoragesta kirjautumisen jälkeen
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(Number(storedId));
  }, []);

  // effectiveUserId: jos showUserView on true ja userId on olemassa, näytetään käyttäjän tiedot
  const effectiveUserId = showUserView && userId ? userId : null;

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
            {/* Nappi vaihtaa näkymää */}
            {userId && (
              <button onClick={() => setShowUserView(prev => !prev)}>
                {showUserView ? "Näytä ei-kirjautunut" : "Näytä kirjautunut"}
              </button>
            )}
          </div>

          {effectiveUserId ? (
            <section>
              <FavMovies userId={effectiveUserId} limit={5} title="Your Favourite Movies" />
            </section>
          ) : (
            <p style={{ textAlign: "center" }}>
              You are not logged in yet. Please log in to access your favourite movies and profile page.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
