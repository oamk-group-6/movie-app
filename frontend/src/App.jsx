
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login.jsx";
import Register from "./components/register.jsx"
import HomePage from "./components/homePage.jsx"
import UserPage from "./components/userPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/**User page */}
        <Route path="/userpage" element={<UserPage />} />

      </Routes>
    </Router>
  ) 
  }

export default App;
