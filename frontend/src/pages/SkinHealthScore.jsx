import { useState, useEffect } from "react";
import "./SkinHealthScore.css";

function SkinHealthScore({ onBackToDashboard }) {
  const [skinProfile, setSkinProfile] = useState(null);
  const [lifestyle, setLifestyle] = useState(null);
  const [sleepData, setSleepData] = useState(null);

  // Get saved skin profile
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

  // Get saved lifestyle data
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      return;
    }

    fetch(`http://127.0.0.1:8000/lifestyle/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.message && !data.error) {
          setLifestyle(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching lifestyle:", error);
      });
  }, []);
  useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return;
  }

  fetch(`http://127.0.0.1:8000/sleep/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.message && !data.error) {
        setSleepData(data);
      }
    })
    .catch((error) => {
      console.error("Error fetching sleep data:", error);
    });
}, []);

  // Skin condition score
  const condition = skinProfile ? 85 : 0;

  // Lifestyle score
  const lifestyleScore = lifestyle
  ? (
      (lifestyle.exercise === "Regular" ? 20 : 10) +
      (lifestyle.diet === "Healthy" ? 20 : 10) +
      (lifestyle.smoking === "No" ? 20 : 0) +
      (lifestyle.alcohol === "No" ? 20 : 0) +
      (lifestyle.sunscreen === "Daily" ? 20 : 10)
    )
  : 0;
  //Sleep score
  const sleepScore = sleepData
  ? (
      sleepData.quality === "Good" ? 60 : 30
    ) +
    (sleepData.interruptions === "No" ? 40 : 20)
  : 0;

  // Other scores
  const routineConsistency = 65;
  const hydration = 80;

  // Weighted Skin Health Score
  const totalScore =
    condition * 0.35 +
    lifestyleScore * 0.20 +
    sleepScore * 0.15 +
    routineConsistency * 0.20 +
    hydration * 0.10;

  const score = Math.round(totalScore);

  let level = "";

  if (score >= 80) {
    level = "Excellent";
  } else if (score >= 60) {
    level = "Good";
  } else if (score >= 40) {
    level = "Needs Improvement";
  } else {
    level = "Poor";
  }

  return (
    <div className="health-score-page">
      <div className="health-score-card">

        <div className="score-logo">🌸</div>

        <h1>Skin Health Score</h1>

        <p className="score-subtitle">
          Your overall skin health based on your current information.
        </p>

        <div className="score-circle">
          <span>{score}</span>
          <small>/ 100</small>
        </div>

        <h2>{level}</h2>

        <div className="score-details">

          <div className="score-item">
            <span>Skin Condition</span>
            <strong>{condition}/100</strong>
          </div>

          <div className="score-item">
            <span>Lifestyle</span>
            <strong>{lifestyleScore}/100</strong>
          </div>

          <div className="score-item">
            <span>Sleep</span>
            <strong>{sleepScore}/100</strong>
          </div>

          <div className="score-item">
            <span>Routine Consistency</span>
            <strong>{routineConsistency}/100</strong>
          </div>

          <div className="score-item">
            <span>Hydration</span>
            <strong>{hydration}/100</strong>
          </div>

        </div>

        <button
          className="back-button"
          onClick={onBackToDashboard}
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default SkinHealthScore;