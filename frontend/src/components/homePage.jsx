import HotNow from "./hotNow";
import NewReleases from "./newReleases";
import SearchBar from "./searchBar";

export default function HomePage() {
  return (
    <div>

      <header style={{ maxWidth: 600, margin: "0 auto 2rem auto", textAlign: "center" }}>
        <h1>Jotain</h1>
        <SearchBar />
      </header>

      
      <section>
        <h2>Hot Now!</h2>
        <HotNow />
      </section>

      
      <section>
        <h2>New Releases</h2>
        <NewReleases />
      </section>
    </div>
  );
}