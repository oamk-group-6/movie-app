import { useEffect, useState } from "react";
import SearchBar from "./components/searchBar";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/book`);
        if (!res.ok) throw new Error("Verkkovirhe");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Virhe haettaessa kirjoja:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) return <p>Ladataan kirjoja...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <header>
      <h1>jotain</h1>
      <SearchBar />
      </header>
    </div>
  );
}

export default App;
