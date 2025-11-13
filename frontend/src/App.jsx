import NewReleases from "./components/newReleases";
import SearchBar from "./components/searchBar";
import "./App.css";

function App() {

  return (
    <div>
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <header>
      <h1>jotain</h1>
      <SearchBar />
      </header>
    </div>
  <div>
      <h2>New Releases</h2>
      <NewReleases />
  </div>
  )
}

export default App;
