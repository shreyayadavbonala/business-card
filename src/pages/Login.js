// src/Login.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setCurrentUser }) {
  // Authentication state managed locally
  let [auth, setAuth] = useState({ username: "", password: "" });
  let [authMessage, setAuthMessage] = useState("");
  const navigate = useNavigate();

  // Helper for input change
  const handleAuthChange = (e) => {
    setAuth((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  async function registerUser(e) {
    e.preventDefault();
    setAuthMessage("Registering...");
    try {
      const resp = await axios.post("http://localhost:5000/auth/register", {
        username: auth.username,
        password: auth.password,
      });
      setAuthMessage(
        resp.data.message || "Registered successfully! Please log in."
      );
    } catch (err) {
      console.error("Register error:", err.response || err.message);
      const msg = err.response?.data?.message || "Register failed";
      setAuthMessage(msg);
    }
  }

  async function loginUser(e) {
    e.preventDefault();
    setAuthMessage("Logging in...");
    try {
      const resp = await axios.post("http://localhost:5000/auth/login", {
        username: auth.username,
        password: auth.password,
      });

      // SUCCESS: Set the user in the App.js state
      const loggedInUsername = auth.username;
      setCurrentUser(loggedInUsername);

      setAuthMessage(resp.data.message || "Login successful. Redirecting...");

      // Automatically navigate to the card creation page
      setTimeout(() => {
        navigate("/create");
      }, 1000); // 1 second delay to display the success message
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      const msg =
        err.response?.data?.message || "Login failed. Invalid credentials.";
      setAuthMessage(msg);
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <h3>Login / Register</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={auth.username}
          onChange={handleAuthChange}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 8,
            padding: 8,
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={auth.password}
          onChange={handleAuthChange}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 8,
            padding: 8,
          }}
        />
        <div
          style={{ display: "flex", gap: 8, justifyContent: "space-between" }}
        >
          <button type="button" onClick={registerUser}>
            Register
          </button>
          <button type="submit" onClick={loginUser}>
            Login
          </button>
        </div>
        {authMessage && (
          <p
            style={{
              marginTop: 8,
              fontSize: "0.9em",
              color:
                authMessage.includes("successful") ||
                authMessage.includes("Registered")
                  ? "green"
                  : "red",
            }}
          >
            {authMessage}
          </p>
        )}
      </form>
    </div>
  );
}
