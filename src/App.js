// src/App.js

import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react"; // NEW: Import useState
import Card from "./card";
import Home from "./pages/Home"; // Assuming Home.js is now in the root
import Login from "./pages/Login"; // NEW: Import Login

function App() {
  // NEW: Lifted state for the current logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // NEW: Logout function
  const logout = () => {
    setCurrentUser(null);
    // You might also want to clear any auth tokens here if using them
  };

  return (
    <BrowserRouter>
      <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link to="/">Home</Link>
          {/* NEW: Conditional Link based on login status */}
          {!currentUser ? (
            <Link to="/login">Login / Register</Link>
          ) : (
            <span style={{ fontWeight: "bold" }}>Welcome, {currentUser}!</span>
          )}
          <Link to="/create">Create Card</Link>
        </nav>
      </header>

      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* NEW Route: Pass setCurrentUser to Login */}
          <Route
            path="/login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          {/* Pass currentUser and logout to Card */}
          <Route
            path="/create"
            element={<Card currentUser={currentUser} logout={logout} />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
