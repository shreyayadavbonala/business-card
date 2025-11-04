// src/Card.js

import { useEffect, useState } from "react";
import axios from "axios";

// Card component now accepts currentUser and logout from App.js
function Card({ currentUser, logout }) {
  let [customize, setCustomize] = useState({
    gradient1: "#007bff", // Changed default to a hex code for consistency
    gradient2: "#ffffff",
    color: "#000000",
    radius: "0", // Changed default to number-like string
  });
  
  let [data, setData] = useState({
    fullname: "John Doe",
    role: "Software developer lead",
    email: "johndoe@gmail.com",
    phNo: "+91 5555555555",
    address: "Avenue,510004",
    skill1: "React Js",
    skill2: "Mongo DB",
    skill3: "Express Js",
    skill4: "Node Js",
  });
  let [cards, setCards] = useState([]);

  // --- AUTH STATE/HANDLERS REMOVED ---
  // [currentUser, auth, authMessage, loginUser, registerUser, logout] are gone.
  // currentUser and logout are now props.

  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  function handleCustomize(event) {
    let name = event.target.name;
    let value = event.target.value;
    setCustomize((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  // Apply a selected card's data and styles to the form and preview
  function applyCard(card) {
    // Update form data
    setData((prev) => ({
      ...prev,
      fullname: card.fullname || "",
      role: card.role || "",
      email: card.email || "",
      phNo: card.phNo || "",
      address: card.address || "",
      skill1: card.skill1 || "",
      skill2: card.skill2 || "",
      skill3: card.skill3 || "",
      skill4: card.skill4 || "",
    }));

    // Normalize radius to a numeric string (remove any trailing 'px')
    let radiusVal = card.radius ?? "0";
    if (typeof radiusVal === "number") radiusVal = String(radiusVal);
    if (typeof radiusVal === "string")
      radiusVal = radiusVal.replace(/px$/i, "");

    // Update customize styles
    setCustomize((prev) => ({
      ...prev,
      gradient1: card.gradient1 || prev.gradient1,
      gradient2: card.gradient2 || prev.gradient2,
      color: card.color || prev.color,
      radius: radiusVal,
    }));
  }

  // Fetch cards for the logged-in user (or clear when logged out)
  async function fetchCardsForUser(username) {
    if (!username) {
      setCards([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/user/cards?username=${encodeURIComponent(
          username
        )}`
      );
      const cards = response.data.cards;
      setCards(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
    }
  }

  useEffect(() => {
    // When currentUser prop changes, load that user's cards
    fetchCardsForUser(currentUser);
  }, [currentUser]); // Now depends on the prop

  async function handleSubmit(event) {
    event.preventDefault();
    if (!currentUser) {
      alert("Please login or register to save a card.");
      return;
    }

    const payload = { ...data, ...customize, owner: currentUser };
    try {
      await axios.post("http://localhost:5000/user/save", payload);
      alert("Card saved successfully!");
      // Refresh cards for this user after save
      fetchCardsForUser(currentUser);
    } catch (err) {
      console.error("Error saving card:", err.response || err.message);
      alert(
        err.response?.data?.message ||
          "Error saving card. Check the console for details."
      );
    }
  }

  if (!currentUser) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Please log in to create and manage cards.</h2>
        <p>Navigate to the **Login** page to continue.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* Sidebar for user info and logout */}
      <div style={{ width: 240, padding: 12, borderRight: "1px solid #eee" }}>
        <div>
          <h3>Logged in as</h3>
          <p style={{ fontWeight: 600, margin: "8px 0" }}>{currentUser}</p>
          <button
            onClick={logout}
            style={{ display: "block", width: "100%", padding: "10px 0" }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          <h1>Your Cards</h1>
          {Array.isArray(cards) && cards.length > 0 ? (
            cards.map((card) => {
              return (
                <div
                  key={card._id || card.email}
                  style={{
                    marginBottom: 8,
                    padding: 8,
                    border: "1px solid #ddd",
                    borderRadius: 4,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    {card.fullname}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9em" }}>{card.email}</p>
                  <button
                    name={card.email}
                    onClick={() => applyCard(card)}
                    style={{ marginTop: 4 }}
                  >
                    Apply
                  </button>
                </div>
              );
            })
          ) : (
            <p>You have no saved cards.</p>
          )}
        </div>
      </div>

      {/* Main Card Creation Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 12,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h3>Create/Customize Card</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={data.fullname}
            onChange={handleChange}
          ></input>
          <input
            type="text"
            value={data.role}
            name="role"
            placeholder="Role"
            onChange={handleChange}
          ></input>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          ></input>
          <input
            type="text"
            name="phNo"
            value={data.phNo}
            placeholder="Phone Number"
            onChange={handleChange}
          ></input>
          <input
            type="text"
            name="address"
            value={data.address}
            placeholder="Address"
            onChange={handleChange}
          ></input>
        </div>

        <h4 style={{ margin: "16px 0 8px 0" }}>Skills</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <input
            type="text"
            name="skill1"
            value={data.skill1}
            placeholder="Skill 1"
            onChange={handleChange}
          ></input>
          <input
            type="text"
            name="skill2"
            value={data.skill2}
            placeholder="Skill 2"
            onChange={handleChange}
          ></input>
          <input
            type="text"
            name="skill3"
            value={data.skill3}
            placeholder="SKill 3"
            onChange={handleChange}
          ></input>
          <input
            type="text"
            name="skill4"
            value={data.skill4}
            placeholder="Skill 4"
            onChange={handleChange}
          ></input>
        </div>

        <h4 style={{ margin: "16px 0 8px 0" }}>Customization</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <label>Color 1:</label>
          <input
            type="color"
            onChange={handleCustomize}
            value={customize.gradient1}
            name="gradient1"
          ></input>
          <label>Color 2:</label>
          <input
            type="color"
            onChange={handleCustomize}
            value={customize.gradient2}
            name="gradient2"
          ></input>
          <label>Text Color:</label>
          <input
            type="color"
            onChange={handleCustomize}
            value={customize.color}
            name="color"
          ></input>
        </div>
        <label>Radius ({customize.radius}px):</label>
        <input
          type="range"
          min={0}
          max={150}
          onChange={handleCustomize}
          name="radius"
          value={customize.radius}
          style={{ width: "100%" }}
        ></input>
        <button
          type="submit"
          style={{ marginTop: 16, padding: 10, width: "100%" }}
        >
          Save Card
        </button>
      </form>

      {/* Card Preview */}
      <div
        id="container"
        style={{
          width: 350,
          height: 220,
          padding: 20,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          color: customize.color,
          borderRadius: `${String(customize.radius).replace(/px$/i, "")}px`,
          background: `linear-gradient(135deg, ${customize.gradient1},${customize.gradient2})`,
        }}
      >
        <div className="section1">
          <h1 style={{ margin: 0, fontSize: "1.5em" }}>{data.fullname}</h1>
          <p style={{ margin: "5px 0 15px 0", fontSize: "1em" }}>{data.role}</p>
        </div>
        <div className="section2">
          <div id="details" style={{ fontSize: "0.85em", lineHeight: 1.5 }}>
            <span>{data.email}</span>
            <br />
            <span>{data.phNo}</span>
            <br />
            <span>{data.address}</span>
          </div>
          <div
            id="buttons"
            style={{ marginTop: 15, display: "flex", flexWrap: "wrap", gap: 5 }}
          >
            {/* Displaying skills as text rather than buttons for simplicity */}
            <span
              style={{
                border: `1px solid ${customize.color}`,
                padding: "2px 5px",
                borderRadius: 3,
                fontSize: "0.7em",
              }}
            >
              {data.skill1}
            </span>
            <span
              style={{
                border: `1px solid ${customize.color}`,
                padding: "2px 5px",
                borderRadius: 3,
                fontSize: "0.7em",
              }}
            >
              {data.skill2}
            </span>
            <span
              style={{
                border: `1px solid ${customize.color}`,
                padding: "2px 5px",
                borderRadius: 3,
                fontSize: "0.7em",
              }}
            >
              {data.skill3}
            </span>
            <span
              style={{
                border: `1px solid ${customize.color}`,
                padding: "2px 5px",
                borderRadius: 3,
                fontSize: "0.7em",
              }}
            >
              {data.skill4}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Card;
