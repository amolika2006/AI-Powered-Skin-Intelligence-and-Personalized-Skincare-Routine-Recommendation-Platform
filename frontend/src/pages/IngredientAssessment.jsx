import { useEffect, useState } from "react";
import "./IngredientAssessment.css";

function IngredientAssessment({ userId, onBackToDashboard }) {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [ingredient, setIngredient] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const [error, setError] = useState("");

  // Load ingredients
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setLoadingIngredients(true);
        setError("");

        const response = await fetch(
          "https://ai-powered-skin-intelligence-and-54n9.onrender.com/ingredients"
        );

        if (!response.ok) {
          throw new Error("Failed to load ingredients");
        }

        const data = await response.json();

        setIngredients(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load ingredient data.");
      } finally {
        setLoadingIngredients(false);
      }
    };

    loadIngredients();
  }, []);

  // Analyze ingredient for current user
  const handleAnalyze = async () => {
    if (!selectedIngredient) {
      setError("Please select an ingredient.");
      return;
    }

    if (!userId) {
      setError("User information not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIngredient(null);
      setAnalysis(null);

      // Get general ingredient information
      const ingredientResponse = await fetch(
        `https://ai-powered-skin-intelligence-and-54n9.onrender.com/ingredient/${encodeURIComponent(
          selectedIngredient
        )}`
      );

      if (!ingredientResponse.ok) {
        throw new Error("Ingredient not found");
      }

      const ingredientData = await ingredientResponse.json();

      setIngredient(ingredientData);

      // Get personalized analysis
      const analysisResponse = await fetch(
        `https://ai-powered-skin-intelligence-and-54n9.onrender.com/ingredient-assessment/${userId}/${encodeURIComponent(
          selectedIngredient
        )}`
      );

      if (!analysisResponse.ok) {
        throw new Error("Personalized analysis failed");
      }

      const analysisData = await analysisResponse.json();

      setAnalysis(analysisData);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to analyze this ingredient for your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ingredient-page">
      <div className="ingredient-card">

        {/* Header */}
        <div className="ingredient-header">

          <div className="ingredient-logo">
            🧴
          </div>

          <div>
            <p className="ingredient-label">
              AI SKIN INTELLIGENCE
            </p>

            <h1>Ingredient Assessment</h1>

            <p className="ingredient-subtitle">
              Analyze skincare ingredients according to your
              skin profile, concerns, allergies and sensitivities.
            </p>
          </div>

        </div>

        {/* Selection */}
        <div className="ingredient-form">

          <label htmlFor="ingredient">
            Select Ingredient
          </label>

          <select
            id="ingredient"
            value={selectedIngredient}
            onChange={(e) => {
              setSelectedIngredient(e.target.value);
              setIngredient(null);
              setAnalysis(null);
              setError("");
            }}
            disabled={loadingIngredients}
          >

            <option value="">
              {loadingIngredients
                ? "Loading ingredients..."
                : "Choose an ingredient"}
            </option>

            {ingredients.map((item) => (
              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>
            ))}

          </select>

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading || loadingIngredients}
          >
            {loading
              ? "Analyzing..."
              : "Analyze Ingredient"}
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="ingredient-error">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="ingredient-message">
            🔍 Checking ingredient suitability with your
            skin profile...
          </div>
        )}

        {/* General Ingredient Information */}
        {ingredient && !loading && (
          <div className="ingredient-result">

            <div className="result-header">

              <div className="result-icon">
                🧴
              </div>

              <div>
                <p className="result-label">
                  INGREDIENT ANALYSIS
                </p>

                <h2>{ingredient.name}</h2>
              </div>

            </div>

            <div className="ingredient-info">

              <div className="info-box">
                <span>Category</span>
                <p>{ingredient.category}</p>
              </div>

              <div className="info-box">
                <span>Description</span>
                <p>{ingredient.description}</p>
              </div>

              <div className="info-box">
                <span>Benefits</span>
                <p>{ingredient.benefits}</p>
              </div>

              <div className="info-box">
                <span>Suitable Skin Types</span>
                <p>{ingredient.suitable_skin_types}</p>
              </div>

              <div className="info-box">
                <span>Target Concerns</span>
                <p>{ingredient.target_concerns}</p>
              </div>

              <div className="info-box warning-box">
                <span>⚠️ Warnings</span>
                <p>{ingredient.warnings}</p>
              </div>

            </div>

            {/* Personalized AI Analysis */}
            {analysis && (
              <div className="personalized-analysis">

                <div className="analysis-header">
                  <div>
                    <p className="result-label">
                      PERSONALIZED AI ANALYSIS
                    </p>

                    <h3>
                      {analysis.suitability}
                    </h3>
                  </div>

                  <div className="suitability-score">
                    {analysis.suitability_score}
                    <span>/100</span>
                  </div>
                </div>

                <div className="analysis-grid">

                  <div className="analysis-box">
                    <strong>🧴 Skin Type</strong>
                    <p>
                      {analysis.skin_type}
                    </p>
                  </div>

                  <div className="analysis-box">
                    <strong>🎯 Concern Match</strong>
                    <p>
                      {analysis.concern_match}
                    </p>
                  </div>

                  <div className="analysis-box">
                    <strong>🛡️ Allergy Check</strong>
                    <p>
                      {analysis.allergy_check}
                    </p>
                  </div>

                  <div className="analysis-box">
                    <strong>⚠️ Sensitivity Check</strong>
                    <p>
                      {analysis.sensitivity_check}
                    </p>
                  </div>

                </div>

                <div className="ai-recommendation">
                  <strong>
                    💡 Personalized Recommendation
                  </strong>

                  <p>
                    {analysis.recommendation}
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Back */}
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

export default IngredientAssessment;