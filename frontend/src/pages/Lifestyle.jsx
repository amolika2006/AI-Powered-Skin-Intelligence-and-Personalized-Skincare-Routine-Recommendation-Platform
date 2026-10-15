import { useState } from "react";
import "./Lifestyle.css";

function Lifestyle({ onBackToDashboard }) {
  const [lifestyle, setLifestyle] = useState({
    waterIntake: "",
    exercise: "",
    diet: "",
    smoking: "No",
    alcohol: "No",
    sunscreen: "Daily",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setLifestyle({
      ...lifestyle,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://ai-powered-skin-intelligence-and-54n9.onrender.com/lifestyle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(localStorage.getItem("userId")),
            water_intake: lifestyle.waterIntake,
            exercise: lifestyle.exercise,
            diet: lifestyle.diet,
            smoking: lifestyle.smoking,
            alcohol: lifestyle.alcohol,
            sunscreen: lifestyle.sunscreen,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        console.log(data);
      } else {
        alert("Failed to save lifestyle information");
        console.log(data);
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="lifestyle-page">

      <div className="lifestyle-container">

        {/* Header */}
        <div className="lifestyle-header">

          <div className="lifestyle-icon">
            🌿
          </div>

          <div>
            <span className="lifestyle-label">
              AI SKIN INTELLIGENCE
            </span>

            <h1>Lifestyle Tracking</h1>

            <p>
              Track your daily habits and understand how they
              support your skin health.
            </p>
          </div>

        </div>


        {/* Info Banner */}
        <div className="lifestyle-info">

          <div className="info-icon">
            ✨
          </div>

          <div>
            <strong>Your lifestyle affects your skin</strong>

            <p>
              Hydration, exercise, diet, sun protection and daily
              habits can contribute to your overall skincare journey.
            </p>
          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* Wellness Section */}
          <div className="lifestyle-section">

            <div className="section-heading">

              <span>01</span>

              <div>
                <h2>Daily Wellness</h2>
                <p>
                  Tell us about your hydration, exercise and diet.
                </p>
              </div>

            </div>


            <div className="lifestyle-grid">

              {/* Water */}
              <div className="lifestyle-field">

                <div className="field-title">
                  <span className="field-icon">💧</span>

                  <div>
                    <label>Daily Water Intake</label>
                    <small>Stay hydrated throughout the day.</small>
                  </div>
                </div>

                <select
                  name="waterIntake"
                  value={lifestyle.waterIntake}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select water intake</option>
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


              {/* Exercise */}
              <div className="lifestyle-field">

                <div className="field-title">
                  <span className="field-icon">🏃</span>

                  <div>
                    <label>Daily Exercise</label>
                    <small>Your usual daily activity level.</small>
                  </div>
                </div>

                <select
                  name="exercise"
                  value={lifestyle.exercise}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select exercise duration
                  </option>

                  <option value="None">
                    None
                  </option>

                  <option value="Less than 30 minutes">
                    Less than 30 minutes
                  </option>

                  <option value="30-60 minutes">
                    30 - 60 minutes
                  </option>

                  <option value="More than 60 minutes">
                    More than 60 minutes
                  </option>
                </select>

              </div>


              {/* Diet */}
              <div className="lifestyle-field">

                <div className="field-title">
                  <span className="field-icon">🥗</span>

                  <div>
                    <label>Diet Type</label>
                    <small>Choose the option closest to your diet.</small>
                  </div>
                </div>

                <select
                  name="diet"
                  value={lifestyle.diet}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select diet type</option>

                  <option value="Balanced">
                    Balanced
                  </option>

                  <option value="Vegetarian">
                    Vegetarian
                  </option>

                  <option value="Vegan">
                    Vegan
                  </option>

                  <option value="High Protein">
                    High Protein
                  </option>

                  <option value="Fast Food / Processed">
                    Fast Food / Processed
                  </option>
                </select>

              </div>

            </div>

          </div>


          {/* Habits Section */}
          <div className="lifestyle-section">

            <div className="section-heading">

              <span>02</span>

              <div>
                <h2>Daily Habits</h2>

                <p>
                  Track habits that may influence your overall
                  skincare routine.
                </p>
              </div>

            </div>


            <div className="lifestyle-grid">

              {/* Smoking */}
              <div className="lifestyle-field">

                <div className="field-title">
                  <span className="field-icon">🚭</span>

                  <div>
                    <label>Smoking</label>
                    <small>Tell us about your smoking habits.</small>
                  </div>
                </div>

                <select
                  name="smoking"
                  value={lifestyle.smoking}
                  onChange={handleChange}
                >
                  <option value="No">No</option>

                  <option value="Occasionally">
                    Occasionally
                  </option>

                  <option value="Regularly">
                    Regularly
                  </option>
                </select>

              </div>


              {/* Alcohol */}
              <div className="lifestyle-field">

                <div className="field-title">
                  <span className="field-icon">🥤</span>

                  <div>
                    <label>Alcohol Consumption</label>
                    <small>Choose your usual consumption level.</small>
                  </div>
                </div>

                <select
                  name="alcohol"
                  value={lifestyle.alcohol}
                  onChange={handleChange}
                >
                  <option value="No">No</option>

                  <option value="Occasionally">
                    Occasionally
                  </option>

                  <option value="Regularly">
                    Regularly
                  </option>
                </select>

              </div>


              {/* Sunscreen */}
              <div className="lifestyle-field">

                <div className="field-title">
                  <span className="field-icon">☀️</span>

                  <div>
                    <label>Sunscreen Usage</label>
                    <small>How regularly do you use sunscreen?</small>
                  </div>
                </div>

                <select
                  name="sunscreen"
                  value={lifestyle.sunscreen}
                  onChange={handleChange}
                >
                  <option value="Daily">
                    Daily
                  </option>

                  <option value="Sometimes">
                    Sometimes
                  </option>

                  <option value="Rarely">
                    Rarely
                  </option>

                  <option value="Never">
                    Never
                  </option>
                </select>

              </div>

            </div>

          </div>


          {/* Success */}
          {saved && (
            <div className="lifestyle-success">

              <div className="success-icon">
                ✓
              </div>

              <div>
                <strong>
                  Lifestyle information saved
                </strong>

                <p>
                  Your lifestyle data has been successfully added
                  to your skincare profile.
                </p>
              </div>

            </div>
          )}


          {/* Buttons */}
          <div className="lifestyle-actions">

            <button
              type="button"
              className="lifestyle-back"
              onClick={onBackToDashboard}
            >
              ← Back to Dashboard
            </button>

            <button
              type="submit"
              className="lifestyle-save"
            >
              ✨ Save Lifestyle Information
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Lifestyle;