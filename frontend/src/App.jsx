
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login.jsx";
import Register from "./components/register.jsx"
import HomePage from "./components/homePage.jsx"
import GroupsPage from "./components/groups/groupsPage.jsx";
import CreateGroupPage from "./components/groups/createGroupPage.jsx";
import GroupDetails from "./components/groups/groupDetail.jsx";


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

        {/* Groups */}
        <Route path="/groups" element={<GroupsPage />} />

        {/* Create Group */}
        <Route path="/groups/create" element={<CreateGroupPage />} />

        {/* Group Details */}
        <Route path="/groups/:id" element={<GroupDetails />} />


      </Routes>
    </Router>
  ) 
  }

export default App;
