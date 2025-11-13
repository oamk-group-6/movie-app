import HomePage from "./components/homePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* muut reitit */}
      </Routes>
    </Router>
  );
}

export default App;
