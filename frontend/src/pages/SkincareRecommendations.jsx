import { useState, useEffect } from "react";
import "./SkincareRecommendations.css";

function SkincareRecommendations({ onBackToDashboard }) {
  const [skinProfile, setSkinProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

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

  // Generate recommendations
  useEffect(() => {
    if (!skinProfile) {
      return;
    }

    const concern = (skinProfile.concerns || "").toLowerCase();
    const skinType = (skinProfile.skin_type || "").toLowerCase();

    const result = [];

    // Cleanser
    result.push({
      category: "Cleanser",
      recommendation:
        skinType.includes("oily") || concern.includes("acne")
          ? "Gentle foaming cleanser"
          : "Gentle hydrating cleanser"
    });

    // Moisturizer
    result.push({
      category: "Moisturizer",
      recommendation:
        skinType.includes("dry")
          ? "Rich moisturizing cream"
          : "Lightweight, non-comedogenic moisturizer"
    });

    // Sunscreen
    result.push({
      category: "Sun Protection",
      recommendation: "Broad-spectrum sunscreen"
    });

    // Acne
    if (concern.includes("acne")) {
      result.push({
        category: "Acne Care",
        recommendation:
          "Acne-focused treatment recommended for your skin concern"
      });
    }

    // Dryness
    if (concern.includes("dry")) {
      result.push({
        category: "Hydration Care",
        recommendation:
          "Hydrating treatment to support skin moisture"
      });
    }

    // Pigmentation
    if (
      concern.includes("pigment") ||
      concern.includes("dark spot")
    ) {
      result.push({
        category: "Pigmentation Care",
        recommendation:
          "Brightening treatment for uneven skin tone"
      });
    }

    // Sensitivity
    if (concern.includes("sensitive")) {
      result.push({
        category: "Sensitive Skin Care",
        recommendation:
          "Fragrance-free and soothing skincare products"
      });
    }

    setRecommendations(result);
  }, [skinProfile]);

  return (
    <div className="recommendation-page">

      <div className="recommendation-card">

        <div className="recommendation-logo">🌸</div>

        <h1>Skincare Recommendations</h1>

        <p className="recommendation-subtitle">
          Recommendations based on your saved skin profile.
        </p>

        {skinProfile && (
          <div className="profile-summary">

            <p>
              <strong>Skin Type:</strong>{" "}
              {skinProfile.skin_type}
            </p>

            <p>
              <strong>Main Concern:</strong>{" "}
              {skinProfile.concerns || "Not specified"}
            </p>

          </div>
        )}

        {recommendations.length > 0 ? (
          <div className="recommendation-list">

            {recommendations.map((item, index) => (
              <div
                className="recommendation-item"
                key={index}
              >
                <h3>{item.category}</h3>

                <p>{item.recommendation}</p>
              </div>
            ))}

          </div>
        ) : (
          <p className="no-recommendations">
            No recommendations available yet.
            Please save your Skin Profile first.
          </p>
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

export default SkincareRecommendations;