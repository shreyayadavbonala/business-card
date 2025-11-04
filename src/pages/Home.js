import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ maxWidth: 800 }}>
      <h1>Business Card Generator</h1>
      <p>
        Create a beautiful business card, save it to your account, and apply
        saved configurations. Use the "Create Card" page to design and save
        cards.
      </p>

      <div style={{ marginTop: 16 }}>
        <Link to="/create">
          <button>Create a Card</button>
        </Link>
      </div>

      <section style={{ marginTop: 24 }}>
        <h3>How it works</h3>
        <ol>
          <li>Register or login from the left panel.</li>
          <li>Use the form on Create Card to design your card.</li>
          <li>Save cards to your account and apply them later.</li>
        </ol>
      </section>
    </div>
  );
}
