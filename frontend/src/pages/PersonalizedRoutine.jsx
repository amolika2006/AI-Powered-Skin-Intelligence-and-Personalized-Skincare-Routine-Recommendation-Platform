import { useState } from "react";
import "./PersonalizedRoutine.css";

function PersonalizedRoutine({ onBackToDashboard }) {
  const [skinType, setSkinType] = useState("");

  const [routine, setRoutine] = useState(null);

  const generateRoutine = (e) => {
    e.preventDefault();

    let selectedRoutine;

    if (skinType === "Oily") {
      selectedRoutine = {
        morning: [
          "Gentle foaming cleanser",
          "Lightweight treatment",
          "Oil-free moisturizer",
          "Broad-spectrum sunscreen",
        ],
        evening: [
          "Gentle cleanser",
          "Skin treatment",
          "Lightweight moisturizer",
        ],
        weekly: [
          "Gentle exfoliation once a week",
          "Hydrating face mask",
        ],
      };
    } else if (skinType === "Dry") {
      selectedRoutine = {
        morning: [
          "Gentle hydrating cleanser",
          "Hydrating treatment",
          "Rich moisturizer",
          "Broad-spectrum sunscreen",
        ],
        evening: [
          "Gentle cleanser",
          "Hydrating treatment",
          "Rich moisturizer",
        ],
        weekly: [
          "Gentle exfoliation once a week",
          "Hydrating face mask",
        ],
      };
    } else if (skinType === "Sensitive") {
      selectedRoutine = {
        morning: [
          "Gentle fragrance-free cleanser",
          "Soothing treatment",
          "Sensitive-skin moisturizer",
          "Broad-spectrum sunscreen",
        ],
        evening: [
          "Gentle fragrance-free cleanser",
          "Soothing treatment",
          "Moisturizer",
        ],
        weekly: [
          "Avoid harsh exfoliation",
          "Use a gentle soothing mask",
        ],
      };
    } else {
      selectedRoutine = {
        morning: [
          "Gentle cleanser",
          "Skin treatment",
          "Moisturizer",
          "Broad-spectrum sunscreen",
        ],
        evening: [
          "Gentle cleanser",
          "Skin treatment",
          "Moisturizer",
        ],
        weekly: [
          "Gentle exfoliation once a week",
          "Hydrating face mask",
        ],
      };
    }

    setRoutine(selectedRoutine);
  };

  return (
    <div className="routine-page">
      <div className="routine-card">

        <div className="routine-logo">🌸</div>

        <h1>Personalized Skincare Routine</h1>

        <p className="routine-subtitle">
          Generate a skincare routine based on your skin type.
        </p>

        <form onSubmit={generateRoutine}>

          <div className="form-group">
            <label>Select Your Skin Type</label>

            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              required
            >
              <option value="">Select Skin Type</option>
              <option value="Normal">Normal</option>
              <option value="Oily">Oily</option>
              <option value="Dry">Dry</option>
              <option value="Combination">Combination</option>
              <option value="Sensitive">Sensitive</option>
            </select>
          </div>

          <button type="submit">
            Generate My Routine
          </button>

        </form>

        {routine && (
          <div className="routine-result">

            <h2>Your Personalized Routine 🧴</h2>

            <div className="routine-section">
              <h3>🌞 Morning Routine</h3>

              <ul>
                {routine.morning.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="routine-section">
              <h3>🌙 Evening Routine</h3>

              <ul>
                {routine.evening.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="routine-section">
              <h3>📅 Weekly Care</h3>

              <ul>
                {routine.weekly.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

        <button
          type="button"
          className="back-button"
          onClick={onBackToDashboard}
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default PersonalizedRoutine;