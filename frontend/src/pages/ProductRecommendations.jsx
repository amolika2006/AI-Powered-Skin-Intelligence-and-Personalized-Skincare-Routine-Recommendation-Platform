import { useEffect, useState } from "react";
import "./ProductRecommendations.css";

function ProductRecommendations({ onBackToDashboard }) {
  const [products, setProducts] = useState([]);
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState("");
  const [allergies, setAllergies] = useState("");
  const [sensitivities, setSensitivities] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecommendations = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://ai-powered-skin-intelligence-and-54n9.onrender.com/recommendations/${userId}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          throw new Error(
            errorData?.detail || "Failed to load recommendations"
          );
        }

        const data = await response.json();

        setProducts(data.recommendations || []);
        setSkinType(data.skin_type || "");
        setConcerns(data.concerns || "");
        setAllergies(data.allergies || "");
        setSensitivities(data.sensitivities || "");
      } catch (error) {
        console.error("Recommendation API Error:", error);

        setError(
          error.message ||
            "Unable to load personalized recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div className="product-page">
      <div className="product-container">

        {/* Header */}
        <div className="product-header">

          <div className="product-logo">
            🛍️
          </div>

          <p className="product-label">
            AI SKIN INTELLIGENCE
          </p>

          <h1>
            Personalized Skincare Recommendations
          </h1>

          <p>
            Discover products selected according to your
            skin type, concerns, allergies, and sensitivities.
          </p>

        </div>

        {/* User Profile Summary */}
        {!loading && !error && (
          <div className="recommendation-profile">

            <div className="profile-item">
              <span>🧴 Your Skin Type</span>
              <strong>
                {skinType || "Not available"}
              </strong>
            </div>

            <div className="profile-item">
              <span>🎯 Your Concerns</span>
              <strong>
                {concerns || "No concerns recorded"}
              </strong>
            </div>

            <div className="profile-item">
              <span>⚠️ Allergies</span>
              <strong>
                {allergies || "None recorded"}
              </strong>
            </div>

            <div className="profile-item">
              <span>🔎 Sensitivities</span>
              <strong>
                {sensitivities || "None recorded"}
              </strong>
            </div>

            <div className="profile-item">
              <span>✨ Recommendations</span>
              <strong>
                {products.length} Products
              </strong>
            </div>

          </div>
        )}

        {/* Safety Information */}
        {!loading && !error && (
          <div className="safety-info">
            <span className="safety-info-icon">🛡️</span>

            <div>
              <strong>Personalized Safety Check</strong>

              <p>
                Products are checked against your recorded
                allergies and sensitivities before being recommended.
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="product-message">
            <span>🔍</span>

            <p>
              Finding products suitable for your skin...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="product-error">
            ⚠️ {error}
          </div>
        )}

        {/* No Products */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="no-products">

              <div className="no-products-icon">
                🔎
              </div>

              <h2>
                No Matching Products Found
              </h2>

              <p>
                We couldn't find products that match your
                current skin profile and safety requirements.
                Try updating your skin type or concerns.
              </p>

            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (

            <div className="product-grid">

              {products.map((product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  {/* Product Top */}
                  <div className="product-top">

                    <div className="product-icon">
                      🧴
                    </div>

                    <div className="product-title">

                      <h2>
                        {product.name}
                      </h2>

                      <p className="product-brand">
                        {product.brand}
                      </p>

                    </div>

                  </div>

                  {/* Category + Match */}
                  <div className="product-meta">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <span className="match-score">
                      🎯 {product.match_score}% Match
                    </span>

                  </div>

                  {/* Safety Badge */}
                  <div
                    className={
                      product.safety_status === "Use with caution"
                        ? "safety-badge caution"
                        : "safety-badge safe"
                    }
                  >

                    {product.safety_status === "Use with caution"
                      ? "⚠️ Use with Caution"
                      : "🛡️ Safety Checked"}

                  </div>

                  {/* Price */}
                  <div className="product-price">
                    ₹{product.price}
                  </div>

                  {/* Match Bar */}
                  <div className="match-container">

                    <div className="match-label">

                      <span>
                        Suitability
                      </span>

                      <strong>
                        {product.match_score}%
                      </strong>

                    </div>

                    <div className="match-bar">

                      <div
                        className="match-fill"
                        style={{
                          width: `${Math.min(
                            product.match_score,
                            100
                          )}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                  {/* Details */}
                  <div className="product-details">

                    {/* Ingredients */}
                    <div className="product-detail-box">

                      <strong>
                        🧪 Ingredients
                      </strong>

                      <p>
                        {product.ingredients ||
                          "Information not available"}
                      </p>

                    </div>

                    {/* Suitable Skin Types */}
                    <div className="product-detail-box">

                      <strong>
                        🌿 Suitable Skin Types
                      </strong>

                      <p>
                        {product.suitable_skin_types ||
                          "Information not available"}
                      </p>

                    </div>

                    {/* Target Concerns */}
                    <div className="product-detail-box">

                      <strong>
                        🎯 Target Concerns
                      </strong>

                      <p>
                        {product.target_concerns ||
                          "Information not available"}
                      </p>

                    </div>

                    {/* Matched Concerns */}
                    {product.matched_concerns &&
                      product.matched_concerns.length > 0 && (

                        <div className="matched-concerns">

                          <strong>
                            ✅ Matched With Your Concerns
                          </strong>

                          <div className="concern-tags">

                            {product.matched_concerns.map(
                              (concern, index) => (

                                <span key={index}>
                                  {concern}
                                </span>

                              )
                            )}

                          </div>

                        </div>

                      )}

                    {/* Sensitivity Warning */}
                    {product.matched_sensitivities &&
                      product.matched_sensitivities.length > 0 && (

                        <div className="sensitivity-warning">

                          <strong>
                            ⚠️ Sensitivity Warning
                          </strong>

                          <p>
                            This product contains ingredients
                            related to your recorded sensitivity:
                          </p>

                          <div className="warning-tags">

                            {product.matched_sensitivities.map(
                              (sensitivity, index) => (

                                <span key={index}>
                                  {sensitivity}
                                </span>

                              )
                            )}

                          </div>

                          <small>
                            Consider performing a patch test
                            before regular use.
                          </small>

                        </div>

                      )}

                    {/* Recommendation Reason */}
                    <div className="recommendation-reason">

                      <strong>
                        💡 Why We Recommend This
                      </strong>

                      <p>
                        {product.explanation}
                      </p>

                    </div>

                    {/* Description */}
                    <div className="product-detail-box">

                      <strong>
                        📝 About This Product
                      </strong>

                      <p>
                        {product.description ||
                          "No description available"}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        {/* Back */}
        <button
          className="product-back-button"
          onClick={onBackToDashboard}
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default ProductRecommendations;