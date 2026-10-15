import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";

function Analytics({ onBackToDashboard }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState("");

  const userId = localStorage.getItem("userId");
  const records = analytics?.records ?? [];
const latestRecord = records.length > 0
  ? records[records.length - 1]
  : {};

  useEffect(() => {
  if (!userId) {
    setError("Please login first.");
    setLoading(false);
    setAiLoading(false);
    return;
  }

  // Analytics API
  fetch(`https://ai-powered-skin-intelligence-and-54n9.onrender.com/analytics/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load analytics");
      }

      return response.json();
    })
    .then((data) => {
      setAnalytics(data);
    })
    .catch((error) => {
      console.error("Analytics API Error:", error);
      setError("Unable to load skincare analytics.");
    })
    .finally(() => {
      setLoading(false);
    });

  // AI Prediction API
  fetch(`https://ai-powered-skin-intelligence-and-54n9.onrender.com/ai-predict/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load AI prediction");
      }

      return response.json();
    })
    .then((data) => {
      setAiResult(data);
    })
    .catch((error) => {
      console.error("AI Prediction API Error:", error);
      setAiError("Unable to generate AI skin analysis.");
    })
    .finally(() => {
      setAiLoading(false);
    });

}, [userId]);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-card">
          <h2>Loading Analytics...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-card">
          <h2>⚠️ {error}</h2>

          <button onClick={onBackToDashboard}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (
  !analytics ||
  analytics.total_records === 0 ||
  !Array.isArray(analytics.records) ||
  analytics.records.length === 0
) {
    return (
      <div className="analytics-page">
        <div className="analytics-card">
          <div className="analytics-icon">📊</div>

          <h1>Skincare Analytics</h1>

          <p>No progress data available yet.</p>

          <button onClick={onBackToDashboard}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">

      <div className="analytics-card">

        <div className="analytics-icon">📊</div>

        <h1>Skincare Analytics</h1>

        <p className="analytics-subtitle">
          Track your skin health progress over time.
        </p>
        {/* AI Skin Analysis */}

<div className="ai-analysis-card">

  <div className="ai-analysis-header">
    <span className="ai-icon">🤖</span>

    <div>
      <h2>AI Skin Analysis</h2>

      <p>
        AI-powered analysis based on your latest skin assessment.
      </p>
    </div>
  </div>

  {aiLoading && (
    <p className="ai-loading">
      🤖 AI is analyzing your skin data...
    </p>
  )}

  {aiError && (
    <p className="ai-error">
      ⚠️ {aiError}
    </p>
  )}

  {aiResult && (
    <div className="ai-result">

      <div className="ai-result-box">
        <span>Primary Skin Concern</span>

        <strong>
          {aiResult.ai_prediction}
        </strong>
      </div>

      <div className="ai-result-box">
        <span>AI Confidence</span>

        <strong>
          {aiResult.confidence}%
        </strong>
      </div>

    </div>
  )}

  {aiResult && (
    <p className="ai-message">
      🧠 {aiResult.message}
    </p>
  )}

</div>

        <div className="analytics-grid">

          <div className="analytics-box">
            <span>Initial Score</span>
            <strong>
              {analytics.first_score ?? "--"}
            </strong>
          </div>

          <div className="analytics-box">
            <span>Latest Score</span>
            <strong>
              {analytics.latest_score ?? "--"}
            </strong>
          </div>

          <div className="analytics-box">
            <span>Improvement</span>
            <strong>
              {analytics.improvement > 0
                ? `+${analytics.improvement}`
                : analytics.improvement ?? "--"}
            </strong>
          </div>

          <div className="analytics-box">
            <span>Trend</span>
            <strong>
              {analytics.trend}
            </strong>
          </div>

        </div>

        <h2>Progress History</h2>
        <h2>Skin Condition Analysis</h2>

<div className="condition-grid">

  <div className="condition-box">
    <span>🧴 Acne</span>
    <strong>
      {latestRecord.acne_level ?? "Not recorded"}
    </strong>
  </div>

  <div className="condition-box">
    <span>💧 Dryness</span>
    <strong>
      {latestRecord.dryness_level ?? "Not recorded"}
    </strong>
  </div>

  <div className="condition-box">
    <span>✨ Oiliness</span>
    <strong>
      {latestRecord.oiliness_level ?? "Not recorded"}
    </strong>
  </div>

  <div className="condition-box">
    <span>🔴 Redness</span>
    <strong>
      {latestRecord.redness_level ?? "Not recorded"}
    </strong>
  </div>

  <div className="condition-box">
    <span>🌸 Pigmentation</span>
    <strong>
      {latestRecord.pigmentation_level ?? "Not recorded"}
    </strong>
  </div>

  <div className="condition-box">
    <span>⚡ Sensitivity</span>
    <strong>
      {latestRecord.sensitivity_level ?? "Not recorded"}
    </strong>
  </div>

</div>

<div className="adherence-box">
  <span>✅ Average Routine Adherence</span>

  <strong>
    {analytics.average_routine_adherence}%
  </strong>
</div>

        <h2>Skin Health Score Trend</h2>

<div className="chart-container">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={analytics.records}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="date"
      />

      <YAxis
        domain={[0, 100]}
      />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="skin_health_score"
        stroke="#c2185b"
        strokeWidth={3}
        dot={{ r: 5 }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

        <div className="analytics-history">

          {analytics.records.map((record, index) => (
            <div className="analytics-record" key={index}>

              <div>
                <strong>{record.date}</strong>
                <p>
                  Routine Adherence:{" "}
                  {record.routine_adherence}%
                </p>
              </div>

              <div className="score">
                {record.skin_health_score}/100
              </div>

            </div>
          ))}

        </div>

        <div className="trend-message">
          {analytics.trend === "Improving" && (
            <p>
              📈 Your skin health score is improving.
              Continue following your skincare routine.
            </p>
          )}

          {analytics.trend === "Stable" && (
            <p>
              ➡️ Your skin health score is currently stable.
            </p>
          )}

          {analytics.trend === "Needs Attention" && (
            <p>
              ⚠️ Your recent skin health score has decreased.
              Review your skincare routine and progress.
            </p>
          )}
        </div>

        <button
          className="back-button"
          onClick={onBackToDashboard}
        >
          ← Back to Dashboard
        </button>
        <button
  type="button"
  className="report-button"
  onClick={() => window.print()}
>
  📄 Print / Save Report as PDF
</button>

      </div>

    </div>
  );
}

export default Analytics;