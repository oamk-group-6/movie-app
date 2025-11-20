import HotNow from "./hotNow";
import NewReleases from "./newReleases";
import SearchBar from "./searchBar";
import "./homePage.css"

export default function HomePage() {
  return (
    <div className="home">

      <header style={{ maxWidth: 600, margin: "0 auto 2rem auto", textAlign: "center" }}>
        <h1>Jotain</h1>
        <SearchBar />
      </header>

      
      <section>
        <h2 className="text">Hot Now!</h2>
        <HotNow />
      </section>

      
      <section>
        <h2 className="text">New Releases</h2>
        <NewReleases />
      </section>
    </div>
  );
}