import { useState } from "react";
import "./SkinAssessment.css";

function SkinAssessment({ onBackToDashboard }) {
  const [assessment, setAssessment] = useState({
    acne: "",
    dryness: "",
    oiliness: "",
    redness: "",
    pigmentation: "",
    sensitivity: "",
  });

  const [result, setResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAssessment({
      ...assessment,
      [e.target.name]: e.target.value,
    });

    setResult(null);
    setAiResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User not found. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setAiResult(null);

    // Calculate basic assessment score
    let score = 0;

    if (assessment.acne === "Severe") score += 2;
    if (assessment.dryness === "Severe") score += 2;
    if (assessment.oiliness === "Severe") score += 2;
    if (assessment.redness === "Severe") score += 2;
    if (assessment.pigmentation === "Severe") score += 2;
    if (assessment.sensitivity === "Severe") score += 2;

    let resultText = "";

    if (score >= 8) {
      resultText =
        "Your skin needs extra care. Consider consulting a dermatologist.";
    } else if (score >= 4) {
      resultText =
        "Your skin shows some concerns. A personalized skincare routine may help.";
    } else {
      resultText =
        "Your skin appears to have mild concerns. Continue a healthy skincare routine.";
    }

    try {
      // STEP 1: Save assessment
      const response = await fetch(
        "https://ai-powered-skin-intelligence-and-54n9.onrender.com/skin-assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            acne: assessment.acne,
            dryness: assessment.dryness,
            oiliness: assessment.oiliness,
            redness: assessment.redness,
            pigmentation: assessment.pigmentation,
            sensitivity: assessment.sensitivity,
            score: score,
            result: resultText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.error ||
            "Failed to save skin assessment."
        );
        return;
      }

      setResult(resultText);

      // STEP 2: Call AI model
      setAiLoading(true);

      const aiResponse = await fetch(
        `https://ai-powered-skin-intelligence-and-54n9.onrender.com/ai-predict/${userId}`
      );

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        setError(
          aiData.detail ||
            aiData.error ||
            "AI analysis could not be completed."
        );
        return;
      }

      // STEP 3: Display AI result
      setAiResult(aiData);

      console.log("Assessment saved:", data);
      console.log("AI Prediction:", aiData);

    } catch (error) {
      console.error("Error:", error);

      setError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  return (
    <div className="assessment-page">

      <div className="assessment-card">

        {/* Header */}
        <div className="assessment-logo">
          🧠
        </div>

        <h1>AI Skin Assessment</h1>

        <p className="subtitle">
          Tell us about your current skin condition and let AI
          identify your primary skin concern.
        </p>


        {/* Assessment Form */}
        <form onSubmit={handleSubmit}>

          {/* Acne */}
          <div className="form-group">
            <label>🧴 Acne</label>

            <select
              name="acne"
              value={assessment.acne}
              onChange={handleChange}
              required
            >
              <option value="">Select severity</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>


          {/* Dryness */}
          <div className="form-group">
            <label>💧 Dryness</label>

            <select
              name="dryness"
              value={assessment.dryness}
              onChange={handleChange}
              required
            >
              <option value="">Select severity</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>


          {/* Oiliness */}
          <div className="form-group">
            <label>✨ Oiliness</label>

            <select
              name="oiliness"
              value={assessment.oiliness}
              onChange={handleChange}
              required
            >
              <option value="">Select severity</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>


          {/* Redness */}
          <div className="form-group">
            <label>🔴 Redness</label>

            <select
              name="redness"
              value={assessment.redness}
              onChange={handleChange}
              required
            >
              <option value="">Select severity</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>


          {/* Pigmentation */}
          <div className="form-group">
            <label>🌸 Pigmentation</label>

            <select
              name="pigmentation"
              value={assessment.pigmentation}
              onChange={handleChange}
              required
            >
              <option value="">Select severity</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>


          {/* Sensitivity */}
          <div className="form-group">
            <label>⚡ Sensitivity</label>

            <select
              name="sensitivity"
              value={assessment.sensitivity}
              onChange={handleChange}
              required
            >
              <option value="">Select severity</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>


          {/* Analyze Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "🔄 Analyzing Your Skin..."
              : "🧠 Analyze My Skin with AI"}
          </button>


          {/* Back Button */}
          <button
            type="button"
            className="back-button"
            onClick={onBackToDashboard}
          >
            ← Back to Dashboard
          </button>

        </form>


        {/* Error */}
        {error && (
          <div className="assessment-error">
            <strong>⚠️ Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}


        {/* Basic Assessment Result */}
        {result && (
          <div className="assessment-result">

            <div className="result-icon">
              📋
            </div>

            <div>
              <h3>Assessment Result</h3>

              <p>{result}</p>
            </div>

          </div>
        )}


        {/* AI Result */}
        {aiLoading && (
          <div className="ai-result ai-loading">

            <div className="ai-result-icon">
              🧠
            </div>

            <div>
              <h3>AI is analyzing your skin...</h3>

              <p>
                Our Random Forest model is processing your
                latest skin assessment.
              </p>
            </div>

          </div>
        )}


        {aiResult && (
          <div className="ai-result">

            <div className="ai-result-header">

              <div className="ai-result-icon">
                🧠
              </div>

              <div>
                <span className="ai-label">
                  AI SKIN ANALYSIS
                </span>

                <h2>
                  Analysis Complete
                </h2>
              </div>

            </div>


            <div className="ai-prediction">

              <span>
                Primary Skin Concern
              </span>

              <strong>
                {aiResult.predicted_concern || "Not available"}
              </strong>

            </div>


            <div className="ai-confidence">

              <div className="confidence-header">

                <span>
                  AI Confidence
                </span>

                <strong>
                  {aiResult.confidence ?? 0}%
                </strong>

              </div>

              <div className="confidence-bar">

                <div
                  className="confidence-fill"
                  style={{
                    width: `${Math.min(
                      Number(aiResult.confidence) || 0,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>


            <p className="ai-note">
              The AI model analyzed your latest skin
              assessment and identified your primary concern
              based on the available assessment data.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default SkinAssessment;