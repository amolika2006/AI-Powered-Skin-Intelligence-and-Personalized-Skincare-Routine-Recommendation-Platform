import { useState, useEffect } from "react";
import "./RoutineGenerator.css";

function RoutineGenerator({ onBackToDashboard }) {
  const [concern, setConcern] = useState("");
  const [routine, setRoutine] = useState(null);
  const[skinProfile, setSkinProfile] = useState(null);

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return;
  }

  fetch(`http://127.0.0.1:8000/skin-profile/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.message && !data.error) {
        setSkinProfile(data);
      }
    })
    .catch((error) => {
      console.error("Error fetching skin profile:", error);
    });
}, []);

   useEffect(() => {
  if (skinProfile && skinProfile.concerns) {
    const savedConcern = skinProfile.concerns.toLowerCase();

    if (savedConcern.includes("acne")) {
      setConcern("Acne");
    } else if (savedConcern.includes("dry")) {
      setConcern("Dryness");
    } else if (savedConcern.includes("oil")) {
      setConcern("Oiliness");
    } else if (
      savedConcern.includes("pigment") ||
      savedConcern.includes("dark spot")
    ) {
      setConcern("Pigmentation");
    } else if (savedConcern.includes("sensitive")) {
      setConcern("Sensitivity");
    }
  }
}, [skinProfile]);
    const generateRoutine = (e) => {
  e.preventDefault();

  let selectedRoutine;

  if (concern === "Acne") {
    selectedRoutine = {
      morning: [
        "Gentle cleanser suitable for your skin type",
        "Lightweight moisturizer",
        "Broad-spectrum sunscreen"
      ],
      evening: [
        "Gentle cleanser",
        "Acne treatment",
        "Lightweight moisturizer"
      ],
      weekly: [
        "Gentle exfoliation once a week",
        "Avoid harsh scrubbing"
      ]
    };
  } else if (concern === "Dryness") {
    selectedRoutine = {
      morning: [
        "Hydrating cleanser",
        "Moisturizing cream",
        "Broad-spectrum sunscreen"
      ],
      evening: [
        "Gentle cleanser",
        "Hydrating treatment",
        "Rich moisturizer"
      ],
      weekly: [
        "Hydrating face mask",
        "Avoid excessive exfoliation"
      ]
    };
  } else if (concern === "Oiliness") {
    selectedRoutine = {
      morning: [
        "Gentle foaming cleanser",
        "Lightweight moisturizer",
        "Broad-spectrum sunscreen"
      ],
      evening: [
        "Gentle cleanser",
        "Oil-control treatment",
        "Lightweight moisturizer"
      ],
      weekly: [
        "Gentle exfoliation once a week",
        "Avoid over-cleansing"
      ]
    };
  } else if (concern === "Pigmentation") {
    selectedRoutine = {
      morning: [
        "Gentle cleanser",
        "Brightening treatment",
        "Moisturizer",
        "Broad-spectrum sunscreen"
      ],
      evening: [
        "Gentle cleanser",
        "Pigmentation-focused treatment",
        "Moisturizer"
      ],
      weekly: [
        "Gentle exfoliation",
        "Avoid excessive sun exposure"
      ]
    };
  } else if (concern === "Sensitivity") {
    selectedRoutine = {
      morning: [
        "Gentle cleanser",
        "Fragrance-free moisturizer",
        "Broad-spectrum sunscreen"
      ],
      evening: [
        "Gentle cleanser",
        "Soothing treatment",
        "Fragrance-free moisturizer"
      ],
      weekly: [
        "Avoid harsh exfoliation",
        "Use soothing skincare products"
      ]
    };
  } else {
    selectedRoutine = {
      morning: [
        "Gentle cleanser",
        "Moisturizer",
        "Broad-spectrum sunscreen"
      ],
      evening: [
        "Gentle cleanser",
        "Moisturizer"
      ],
      weekly: [
        "Gentle exfoliation once a week",
        "Maintain a consistent skincare routine"
      ]
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
          Generate a skincare routine based on your main skin concern.
        </p>

        <form onSubmit={generateRoutine}>

          <div className="form-group">
            <label>Main Skin Concern</label>

            <select
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              required
            >
              <option value="">Select Concern</option>
              <option value="Acne">Acne</option>
              <option value="Dryness">Dryness</option>
              <option value="Oiliness">Oiliness</option>
              <option value="Pigmentation">Pigmentation</option>
              <option value="Sensitivity">Sensitivity</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit">
            Generate My Routine
          </button>

        </form>

        {routine && (
          <div className="routine-result">

            <h2>Your Personalized Routine</h2>
            {skinProfile && (
            <p>
               Skin Type: <strong>{skinProfile.skin_type}</strong>
            </p>
            )}

            {skinProfile && (skinProfile.allergies || skinProfile.sensitivities) && (
            <p>
              <strong>Important:</strong> Your routine should avoid products
              containing your listed allergies or sensitivities.
            </p>
         )}

            <div className="routine-section">
              <h3>Morning Routine</h3>

              <ul>
                {routine.morning.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="routine-section">
              <h3>Evening Routine</h3>

              <ul>
                {routine.evening.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="routine-section">
              <h3>Weekly Routine</h3>

              <ul>
                {routine.weekly.map((step, index) => (
                  <li key={index}>{step}</li>
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
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default RoutineGenerator;