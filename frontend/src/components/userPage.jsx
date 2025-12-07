import { useState } from "react";
import FavMovies from "./favMovies";
import SearchBar from "./searchBar";
import ProfileSidebar from "./profileSidebar";
import { useUserIdFromToken } from "../hooks/useUserIdFromToken";
import "./userPage.css";

export default function UserPage() {
  const userId = useUserIdFromToken(); // haetaan tokenista
  const [showUserView, setShowUserView] = useState(true);
  const effectiveUserId = showUserView && userId ? userId : null;

  return (
    <div className="userpage">
      <header style={{ maxWidth: 600, margin: "0 auto 2rem auto", textAlign: "center" }}>
        <h1>Jotain</h1>
        <SearchBar />
      </header>

      <div className="userpage-content">
        {effectiveUserId && <ProfileSidebar userId={effectiveUserId} />}

        <main className="main-content">
          <div className="userpage-header">
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
