import React, { useState } from "react";
import "./SkinProfile.css";

function SkinProfile({ onBackToDashboard }) {
  const [profile, setProfile] = useState({
    skinType: "",
    ageGroup: "",
    concerns: "",
    allergies: "",
    sensitivities: "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login again.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/skin-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            skin_type: profile.skinType,
            age_group: profile.ageGroup,
            concerns: profile.concerns,
            allergies: profile.allergies,
            sensitivities: profile.sensitivities,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        console.log("Profile saved:", data);
      } else {
        alert(data.detail || "Failed to save skin profile.");
        console.log(data);
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* Header */}
        <div className="profile-header">

          <div className="profile-icon">
            👤
          </div>

          <div>
            <span className="profile-label">
              AI SKIN INTELLIGENCE
            </span>

            <h1>Build Your Skin Profile</h1>

            <p>
              Tell us about your skin so we can personalize
              your skincare journey.
            </p>
          </div>

        </div>

        {/* Information Banner */}
        <div className="profile-info">

          <div className="info-icon">
            ✨
          </div>

          <div>
            <strong>
              Personalized skincare starts here
            </strong>

            <p>
              Your information helps the system understand your
              skin and provide more relevant recommendations.
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}
          <div className="profile-section">

            <div className="section-heading">

              <span>01</span>

              <div>
                <h2>Basic Information</h2>

                <p>
                  Tell us about your skin type and age group.
                </p>
              </div>

            </div>

            <div className="profile-grid">

              {/* Skin Type */}
              <div className="profile-field">

                <label>
                  Skin Type
                </label>

                <select
                  name="skinType"
                  value={profile.skinType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Skin Type
                  </option>

                  <option value="normal">
                    Normal
                  </option>

                  <option value="dry">
                    Dry
                  </option>

                  <option value="oily">
                    Oily
                  </option>

                  <option value="combination">
                    Combination
                  </option>

                  <option value="sensitive">
                    Sensitive
                  </option>
                </select>

              </div>

              {/* Age Group */}
              <div className="profile-field">

                <label>
                  Age Group
                </label>

                <select
                  name="ageGroup"
                  value={profile.ageGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Age Group
                  </option>

                  <option value="under18">
                    Under 18
                  </option>

                  <option value="18-25">
                    18 - 25
                  </option>

                  <option value="26-35">
                    26 - 35
                  </option>

                  <option value="36-45">
                    36 - 45
                  </option>

                  <option value="46+">
                    46+
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* Skin Concerns */}
          <div className="profile-section">

            <div className="section-heading">

              <span>02</span>

              <div>
                <h2>Skin Concerns</h2>

                <p>
                  Tell us what you would like to improve.
                </p>
              </div>

            </div>

            <div className="profile-field full-field">

              <label>
                Main Skin Concerns
              </label>

              <input
                type="text"
                name="concerns"
                placeholder="e.g. Acne, dark spots, dryness, pigmentation"
                value={profile.concerns}
                onChange={handleChange}
              />

              <small>
                You can enter multiple concerns separated by commas.
              </small>

            </div>

          </div>

          {/* Safety & Sensitivities */}
          <div className="profile-section">

            <div className="section-heading">

              <span>03</span>

              <div>
                <h2>Safety & Sensitivities</h2>

                <p>
                  Help us identify ingredients or products you may
                  need to avoid.
                </p>
              </div>

            </div>

            <div className="profile-grid">

              {/* Allergies */}
              <div className="profile-field">

                <label>
                  ⚠️ Allergies
                </label>

                <input
                  type="text"
                  name="allergies"
                  placeholder="Enter any known allergies"
                  value={profile.allergies}
                  onChange={handleChange}
                />

              </div>

              {/* Sensitivities */}
              <div className="profile-field">

                <label>
                  ⚡ Skin Sensitivities
                </label>

                <input
                  type="text"
                  name="sensitivities"
                  placeholder="e.g. Fragrance, acids"
                  value={profile.sensitivities}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

          {/* Success Message */}
          {saved && (
            <div className="profile-success">

              <span>✓</span>

              <div>
                <strong>
                  Profile saved successfully
                </strong>

                <p>
                  Your skin information has been added to your
                  personalized skincare profile.
                </p>
              </div>

            </div>
          )}

          {/* Buttons */}
          <div className="profile-actions">

            {/* BACK BUTTON */}
            <button
              type="button"
              className="profile-back"
              onClick={onBackToDashboard}
            >
              ← Back to Dashboard
            </button>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="profile-save"
            >
              ✨ Save Skin Profile
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SkinProfile;