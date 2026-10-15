import { useEffect, useState } from "react";
import "./ProgressTracking.css";

function ProgressTracking({ onBackToDashboard }) {
  const [progress, setProgress] = useState({
    skin_health_score: "",
    acne_level: "",
    dryness_level: "",
    oiliness_level: "",
    redness_level: "",
    pigmentation_level: "",
    sensitivity_level: "",
    routine_adherence: "",
    notes: "",
  });

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://127.0.0.1:8000/progress/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load progress");
        }

        return response.json();
      })
      .then((data) => {
        setHistory(data);
      })
      .catch((error) => {
        console.error("Progress API Error:", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    setProgress({
      ...progress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("Please login first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            skin_health_score: Number(progress.skin_health_score),
            acne_level: progress.acne_level,
            dryness_level: progress.dryness_level,
            oiliness_level: progress.oiliness_level,
            redness_level: progress.redness_level,
            pigmentation_level: progress.pigmentation_level,
            sensitivity_level: progress.sensitivity_level,
            routine_adherence: Number(progress.routine_adherence),
            notes: progress.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save progress");
      }

      setMessage("Progress saved successfully! ✅");

      setProgress({
        skin_health_score: "",
        acne_level: "",
        dryness_level: "",
        oiliness_level: "",
        redness_level: "",
        pigmentation_level: "",
        sensitivity_level: "",
        routine_adherence: "",
        notes: "",
      });

      // Refresh history
      const historyResponse = await fetch(
        `http://127.0.0.1:8000/progress/${userId}`
      );

      const historyData = await historyResponse.json();
      setHistory(historyData);
    } catch (error) {
      console.error("Save Progress Error:", error);
      setMessage("Unable to save progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="progress-page">

      <div className="progress-card">

        <div className="progress-logo">📊</div>

        <h1>Skin Progress Tracking</h1>

        <p className="progress-subtitle">
          Record your current skin condition and monitor your progress over time.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="progress-grid">

            <div className="form-group">
              <label>Skin Health Score</label>
              <input
                type="number"
                name="skin_health_score"
                min="0"
                max="100"
                value={progress.skin_health_score}
                onChange={handleChange}
                placeholder="Enter score (0-100)"
                required
              />
            </div>

            <div className="form-group">
              <label>Routine Adherence (%)</label>
              <input
                type="number"
                name="routine_adherence"
                min="0"
                max="100"
                value={progress.routine_adherence}
                onChange={handleChange}
                placeholder="Example: 80"
                required
              />
            </div>

            <div className="form-group">
              <label>Acne</label>
              <select name="acne_level" value={progress.acne_level} onChange={handleChange} required>
                <option value="">Select</option>
                <option>None</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dryness</label>
              <select name="dryness_level" value={progress.dryness_level} onChange={handleChange} required>
                <option value="">Select</option>
                <option>None</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Oiliness</label>
              <select name="oiliness_level" value={progress.oiliness_level} onChange={handleChange} required>
                <option value="">Select</option>
                <option>None</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Redness</label>
              <select name="redness_level" value={progress.redness_level} onChange={handleChange} required>
                <option value="">Select</option>
                <option>None</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Pigmentation</label>
              <select name="pigmentation_level" value={progress.pigmentation_level} onChange={handleChange} required>
                <option value="">Select</option>
                <option>None</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Sensitivity</label>
              <select name="sensitivity_level" value={progress.sensitivity_level} onChange={handleChange} required>
                <option value="">Select</option>
                <option>None</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </div>

          </div>

          <div className="form-group">
            <label>Progress Notes</label>

            <textarea
              name="notes"
              value={progress.notes}
              onChange={handleChange}
              placeholder="Write your observations..."
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Progress"}
          </button>

        </form>

        {message && (
          <div className="progress-message">
            {message}
          </div>
        )}

        <h2>Progress History</h2>

        {history.length === 0 ? (
          <p>No progress records found.</p>
        ) : (
          <div className="progress-history">

            {history.map((item) => (
              <div className="history-card" key={item.id}>

                <h3>📅 {item.progress_date}</h3>

                <p>
                  <strong>Health Score:</strong>{" "}
                  {item.skin_health_score}/100
                </p>

                <p>
                  <strong>Routine Adherence:</strong>{" "}
                  {item.routine_adherence}%
                </p>

                <p>
                  <strong>Acne:</strong> {item.acne_level}
                </p>

                <p>
                  <strong>Dryness:</strong> {item.dryness_level}
                </p>

                <p>
                  <strong>Oiliness:</strong> {item.oiliness_level}
                </p>

                <p>
                  <strong>Redness:</strong> {item.redness_level}
                </p>

                <p>
                  <strong>Pigmentation:</strong>{" "}
                  {item.pigmentation_level}
                </p>

                <p>
                  <strong>Sensitivity:</strong>{" "}
                  {item.sensitivity_level}
                </p>

                {item.notes && (
                  <p>
                    <strong>Notes:</strong> {item.notes}
                  </p>
                )}

              </div>
            ))}

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

export default ProgressTracking;