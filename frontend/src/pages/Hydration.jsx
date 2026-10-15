import { useState } from "react";
import "./Hydration.css";

function Hydration({ onBackToDashboard }) {
  const [hydration, setHydration] = useState({
    waterIntake: "",
    glasses: "",
    goal: "2-3 litres",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setHydration({
      ...hydration,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://ai-powered-skin-intelligence-and-54n9.onrender.com/hydration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(localStorage.getItem("userId")),
            water_intake: hydration.waterIntake,
            glasses: hydration.glasses,
            goal: hydration.goal,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        console.log(data);
      } else {
        alert("Failed to save hydration information");
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="hydration-page">

      <div className="hydration-container">

        {/* HEADER */}

        <div className="hydration-header">

          <div className="hydration-header-icon">
            💧
          </div>

          <div>
            <span className="hydration-label">
              AI SKIN INTELLIGENCE
            </span>

            <h1>Hydration Tracking</h1>

            <p>
              Monitor your daily water intake and maintain
              healthy hydration habits for your skincare journey.
            </p>
          </div>

        </div>


        {/* MAIN CONTENT */}

        <form onSubmit={handleSubmit}>

          {/* TODAY'S HYDRATION */}

          <section className="hydration-section">

            <div className="section-title">

              <span className="section-number">
                01
              </span>

              <div>
                <h2>Today's Hydration</h2>

                <p>
                  Record how much water you consumed today.
                </p>
              </div>

            </div>


            <div className="hydration-grid">

              <div className="hydration-field">

                <label>
                  Water Intake
                </label>

                <select
                  name="waterIntake"
                  value={hydration.waterIntake}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select water intake
                  </option>

                  <option value="Less than 1 litre">
                    Less than 1 litre
                  </option>

                  <option value="1-2 litres">
                    1 - 2 litres
                  </option>

                  <option value="2-3 litres">
                    2 - 3 litres
                  </option>

                  <option value="More than 3 litres">
                    More than 3 litres
                  </option>
                </select>

              </div>


              <div className="hydration-field">

                <label>
                  Number of Glasses
                </label>

                <input
                  type="number"
                  name="glasses"
                  min="0"
                  max="30"
                  placeholder="e.g. 8"
                  value={hydration.glasses}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>


          {/* DAILY GOAL */}

          <section className="hydration-section">

            <div className="section-title">

              <span className="section-number">
                02
              </span>

              <div>
                <h2>Daily Hydration Goal</h2>

                <p>
                  Select your target water intake for the day.
                </p>
              </div>

            </div>


            <div className="hydration-field">

              <label>
                Your Daily Goal
              </label>

              <select
                name="goal"
                value={hydration.goal}
                onChange={handleChange}
              >
                <option value="1-2 litres">
                  1 - 2 litres
                </option>

                <option value="2-3 litres">
                  2 - 3 litres
                </option>

                <option value="More than 3 litres">
                  More than 3 litres
                </option>
              </select>

            </div>

          </section>


          {/* SUCCESS */}

          {saved && (
            <div className="hydration-success">
              <span>✓</span>

              <div>
                <strong>Hydration information saved</strong>

                <p>
                  Your today's hydration record has been successfully added.
                </p>
              </div>
            </div>
          )}


          {/* ACTIONS */}

          <div className="hydration-actions">

            <button
              type="button"
              className="hydration-back"
              onClick={onBackToDashboard}
            >
              ← Back to Dashboard
            </button>

            <button
              type="submit"
              className="hydration-save"
            >
              💧 Save Hydration
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Hydration;