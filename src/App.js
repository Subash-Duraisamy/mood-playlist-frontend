import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMood("");
    setPlaylist([]);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setMood(data.mood);
      setPlaylist(data.playlist);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="App" style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>🎵 Mood-Based Playlist Generator</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <textarea
          placeholder="Type how you feel today..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          cols={40}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <br />
        <button
          type="submit"
          disabled={!text || loading}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Predicting..." : "Get Playlist"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {mood && (
        <div>
          <h2>Detected Mood: {mood}</h2>
          <h3>Your Playlist:</h3>
          <ul>
            {playlist.map((song, idx) => (
              <li key={idx}>{song}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
