import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ onBackToDashboard }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://ai-powered-skin-intelligence-and-54n9.onrender.com/admin/dashboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load admin dashboard");
        }

        return response.json();
      })
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load dashboard data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>

        <button onClick={onBackToDashboard}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="admin-header">

        <div>
          <span className="admin-label">
            ADMIN PANEL
          </span>

          <h1>
            Executive Dashboard
          </h1>

          <p>
            Overview of users, skin health, assessments and
            skincare intelligence.
          </p>
        </div>

        <button
          className="admin-back-btn"
          onClick={onBackToDashboard}
        >
          ← Back to Dashboard
        </button>

      </header>

      {/* Statistics Cards */}
      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <span>Total Users</span>
            <h2>{dashboard.total_users}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🧴</div>

          <div>
            <span>Skin Profiles</span>
            <h2>{dashboard.total_skin_profiles}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📝</div>

          <div>
            <span>Assessments</span>
            <h2>{dashboard.total_assessments}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🛍️</div>

          <div>
            <span>Products</span>
            <h2>{dashboard.total_products}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🧪</div>

          <div>
            <span>Ingredients</span>
            <h2>{dashboard.total_ingredients}</h2>
          </div>
        </div>

        <div className="admin-stat-card health-card">
          <div className="stat-icon">❤️</div>

          <div>
            <span>Average Health Score</span>

            <h2>
              {dashboard.average_health_score}
              <small>/100</small>
            </h2>
          </div>
        </div>

      </section>

      {/* Analytics */}
      <section className="admin-grid">

        {/* Skin Type */}
        <div className="admin-panel">

          <div className="panel-heading">
            <div>
              <h2>Skin Type Distribution</h2>
              <p>Registered user skin profiles</p>
            </div>

            <span className="panel-icon">◉</span>
          </div>

          {dashboard.skin_type_distribution?.length > 0 ? (

            <div className="skin-type-list">

              {dashboard.skin_type_distribution.map(
                (item, index) => {

                  const total =
                    dashboard.total_skin_profiles || 1;

                  const percentage =
                    Math.round(
                      (item.count / total) * 100
                    );

                  return (
                    <div
                      className="distribution-item"
                      key={index}
                    >

                      <div className="distribution-top">

                        <span>
                          {item.skin_type}
                        </span>

                        <strong>
                          {item.count}
                        </strong>

                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${percentage}%`
                          }}
                        ></div>
                      </div>

                      <small>
                        {percentage}% of profiles
                      </small>

                    </div>
                  );
                }
              )}

            </div>

          ) : (
            <div className="empty-state">
              No skin type data available.
            </div>
          )}

        </div>

        {/* Common Concerns */}
        <div className="admin-panel">

          <div className="panel-heading">
            <div>
              <h2>Common Skin Concerns</h2>
              <p>Most reported concerns</p>
            </div>

            <span className="panel-icon">🎯</span>
          </div>

          {dashboard.common_concerns?.length > 0 ? (

            <div className="concern-list">

              {dashboard.common_concerns
                .slice(0, 8)
                .map((item, index) => (

                  <div
                    className="concern-row"
                    key={index}
                  >

                    <div className="concern-number">
                      {index + 1}
                    </div>

                    <div className="concern-name">
                      {item.concern}
                    </div>

                    <div className="concern-count">
                      {item.count}
                    </div>

                  </div>

                ))}

            </div>

          ) : (
            <div className="empty-state">
              No concern data available.
            </div>
          )}

        </div>

      </section>

      {/* Recent Assessments */}
      <section className="admin-panel full-panel">

        <div className="panel-heading">

          <div>
            <h2>Recent Skin Assessments</h2>
            <p>Latest assessment activity</p>
          </div>

          <span className="panel-icon">📋</span>

        </div>

        {dashboard.recent_assessments?.length > 0 ? (

          <div className="table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Assessment ID</th>
                  <th>User ID</th>
                  <th>Result</th>
                  <th>Score</th>
                </tr>
              </thead>

              <tbody>

                {dashboard.recent_assessments.map(
                  (assessment) => (

                    <tr key={assessment.id}>

                      <td>
                        #{assessment.id}
                      </td>

                      <td>
                        {assessment.user_id}
                      </td>

                      <td>
                        <span className="result-badge">
                          {assessment.result}
                        </span>
                      </td>

                      <td>
                        {assessment.score ?? "—"}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (
          <div className="empty-state">
            No recent assessments available.
          </div>
        )}

      </section>

      {/* Recent Progress */}
      <section className="admin-panel full-panel">

        <div className="panel-heading">

          <div>
            <h2>Recent Progress</h2>
            <p>User skin health progress</p>
          </div>

          <span className="panel-icon">📈</span>

        </div>

        {dashboard.recent_progress?.length > 0 ? (

          <div className="table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Date</th>
                  <th>Health Score</th>
                  <th>Routine Adherence</th>
                </tr>
              </thead>

              <tbody>

                {dashboard.recent_progress.map(
                  (item, index) => (

                    <tr key={index}>

                      <td>
                        {item.user_id}
                      </td>

                      <td>
                        {item.progress_date}
                      </td>

                      <td>
                        <span className="score-badge">
                          {item.skin_health_score}
                        </span>
                      </td>

                      <td>
                        {item.routine_adherence ?? "—"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (
          <div className="empty-state">
            No progress data available.
          </div>
        )}

      </section>

    </div>
  );
}

export default AdminDashboard;