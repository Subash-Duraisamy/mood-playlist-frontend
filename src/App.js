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
    <div className="App">
      <div className="heading-container">
        <h1 className="swing-heading">🎵 Mood-Based Playlist Generator</h1>
        <p className="subtitle">
          Type how you feel, and get a custom playlist matching your mood!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-wrapper">
        <textarea
          placeholder="Type how you feel today..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="text-input"
        />
        <button type="submit" disabled={!text || loading} className="btn-primary">
          {loading ? "Predicting..." : "Get Playlist"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {mood && (
        <div className="result-card">
          <h2 className="result-mood">Detected Mood: <span className="blue-letter">{mood}</span></h2>
          <h3>Your Playlist:</h3>
          <ul className="playlist-list">
            {playlist.map((song, idx) => (
              <li key={idx} className="playlist-item">{song}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
