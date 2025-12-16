
import FavMovies from "./favMovies";
import SearchBar from "./searchBar";
import ProfileSidebar from "./profileSidebar";
import { useUserIdFromToken } from "../hooks/useUserIdFromToken";
import "./userPage.css";

export default function UserPage() {
  const userId = useUserIdFromToken(); // haetaan tokenista
 

  return (
  <div className="userpage">
    <header style={{ maxWidth: 600, margin: "0 auto 2rem auto", textAlign: "center" }}>
      <h1>Jotain</h1>
      <SearchBar />
    </header>

    <div className="userpage-content">
      {userId && <ProfileSidebar userId={userId} />}

      <main className="main-content">
        {userId ? (
          <section>
            <FavMovies
              userId={userId}
              limit={5}
              title="Your Favourite Movies"
            />
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
