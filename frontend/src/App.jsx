
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login.jsx";
import Register from "./components/register.jsx"
//import HomePage from "./components/homePage.jsx"

function App() {
  return (
    <Router>
      <Routes>

        {/* Etusivu Tähän myöhemmin: <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<Login />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  ) 
  }

export default App;
