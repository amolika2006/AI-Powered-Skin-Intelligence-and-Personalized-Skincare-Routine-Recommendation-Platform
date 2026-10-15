import "./Dashboard.css";

function Dashboard({
  onManageSkinProfile,
  onLifestyle,
  onSleep,
  onHydration,
  onSkinAssessment,
  onSkinHealthScore,
  onPersonalizedRoutine,
  onRoutineGenerator,
  onSkincareRecommendations,
  onIngredientAssessment,
  onProductRecommendations,
  onProgressTracking,
  onAnalytics,
  onAdminDashboard,
  onConsultantDashboard,
  onBookConsultation,
  onLogout,
}) {
  // Time-based greeting
  const currentHour = new Date().getHours();

  let greeting = "Good Evening";
  let greetingIcon = "🌙";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
    greetingIcon = "☀️";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
    greetingIcon = "🌤️";
  }

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}
      <header className="dashboard-header">

        <div className="dashboard-brand">
          <div className="brand-icon">✦</div>

          <div>
            <h1>AI Skin Intelligence</h1>
            <p>Personalized Skincare Planner</p>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>


      {/* ================= MAIN ================= */}
      <main className="dashboard-content">

        {/* Greeting */}
        <section className="dashboard-welcome">

          <div className="welcome-icon">
            {greetingIcon}
          </div>

          <div>
            <span className="welcome-label">
              YOUR PERSONAL SKINCARE SPACE
            </span>

            <h2>
              {greeting}, Welcome Back! 👋
            </h2>

            <p>
              Take care of your skin, understand your needs,
              and build a routine that's personalized for you.
            </p>
          </div>

        </section>


        {/* ================= DASHBOARD FEATURES ================= */}

        <div className="dashboard-grid">

          {/* Skin Profile */}
          <div className="dashboard-card">

            <div className="card-icon">👤</div>

            <div className="card-content">
              <h3>Skin Profile</h3>

              <p>
                Add your skin type, age group, skin concerns,
                allergies and sensitivities.
              </p>

              <button onClick={onManageSkinProfile}>
                Manage Skin Profile →
              </button>
            </div>

          </div>


          {/* Lifestyle */}
          <div className="dashboard-card">

            <div className="card-icon">🌿</div>

            <div className="card-content">
              <h3>Lifestyle Tracking</h3>

              <p>
                Track your lifestyle habits and environmental
                factors that may affect your skin.
              </p>

              <button onClick={onLifestyle}>
                Track Lifestyle →
              </button>
            </div>

          </div>


          {/* Sleep */}
          <div className="dashboard-card">

            <div className="card-icon">😴</div>

            <div className="card-content">
              <h3>Sleep Tracking</h3>

              <p>
                Record your sleep quality and sleeping patterns
                to understand their impact on your skin.
              </p>

              <button onClick={onSleep}>
                Track Sleep →
              </button>
            </div>

          </div>


          {/* Hydration */}
          <div className="dashboard-card">

            <div className="card-icon">💧</div>

            <div className="card-content">
              <h3>Hydration</h3>

              <p>
                Keep track of your daily water intake and
                maintain healthy hydration habits.
              </p>

              <button onClick={onHydration}>
                Track Hydration →
              </button>
            </div>

          </div>


          {/* Skin Assessment */}
          <div className="dashboard-card ai-card">

            <div className="card-icon">🧠</div>

            <div className="card-content">
              <span className="ai-badge">AI POWERED</span>

              <h3>Skin Assessment</h3>

              <p>
                Analyze your skin condition and identify
                your major skin concerns.
              </p>

              <button onClick={onSkinAssessment}>
                Start AI Assessment →
              </button>
            </div>

          </div>


          {/* Skin Health Score */}
          <div className="dashboard-card">

            <div className="card-icon">📊</div>

            <div className="card-content">
              <h3>Skin Health Score</h3>

              <p>
                View your overall skin health score based on
                your condition, lifestyle, sleep and hydration.
              </p>

              <button onClick={onSkinHealthScore}>
                View Health Score →
              </button>
            </div>

          </div>


          {/* Personalized Routine */}
          <div className="dashboard-card">

            <div className="card-icon">🧴</div>

            <div className="card-content">
              <h3>Personalized Routine</h3>

              <p>
                Generate a morning, evening and weekly skincare
                routine based on your skin type.
              </p>

              <button onClick={onPersonalizedRoutine}>
                Create My Routine →
              </button>
            </div>

          </div>


          {/* Routine Generator */}
          <div className="dashboard-card ai-card">

            <div className="card-icon">✨</div>

            <div className="card-content">
              <span className="ai-badge">SMART PLANNER</span>

              <h3>Routine Generator</h3>

              <p>
                Generate a customized skincare routine based
                on your main skin concern.
              </p>

              <button onClick={onRoutineGenerator}>
                Generate Routine →
              </button>
            </div>

          </div>


          {/* Skincare Recommendations */}
          <div className="dashboard-card">

            <div className="card-icon">💡</div>

            <div className="card-content">
              <h3>Skincare Recommendations</h3>

              <p>
                Get personalized skincare recommendations based
                on your saved skin type and concerns.
              </p>

              <button onClick={onSkincareRecommendations}>
                View Recommendations →
              </button>
            </div>

          </div>


          {/* Progress Tracking */}
          <div className="dashboard-card">

            <div className="card-icon">📈</div>

            <div className="card-content">
              <h3>Progress Tracking</h3>

              <p>
                Track your skin health, routine adherence and
                changes in your skin condition over time.
              </p>

              <button onClick={onProgressTracking}>
                Track My Progress →
              </button>
            </div>

          </div>


          {/* Analytics */}
          <div className="dashboard-card">

            <div className="card-icon">📊</div>

            <div className="card-content">
              <h3>Skincare Analytics</h3>

              <p>
                Analyze your skin health score, improvement
                and progress trends over time.
              </p>

              <button onClick={onAnalytics}>
                View Analytics →
              </button>
            </div>

          </div>

         {onAdminDashboard && (
  <div className="dashboard-card admin-card">
    <div className="card-icon">🛡️</div>

    <div className="card-content">
      <span className="ai-badge">ADMIN PANEL</span>

      <h3>Admin Dashboard</h3>

      <p>
        View overall users, skin profiles, assessments,
        products, ingredients and skincare analytics.
      </p>

      <button onClick={onAdminDashboard}>
        Open Admin Dashboard →
      </button>
    </div>
  </div>
)}

{onConsultantDashboard && (
  <div className="dashboard-card professional-card">
    <div className="card-icon">🩺</div>

    <div className="card-content">
      <span className="ai-badge">PROFESSIONAL PANEL</span>

      <h3>Consultant Dashboard</h3>

      <p>
        Manage patient profiles, skin assessments,
        consultations and personalized skincare guidance.
      </p>

      <button onClick={onConsultantDashboard}>
        Open Professional Dashboard →
      </button>
    </div>
  </div>
)}


          {/* Ingredient Assessment */}
          <div className="dashboard-card">

            <div className="card-icon">🧪</div>

            <div className="card-content">
              <h3>Ingredient Assessment</h3>

              <p>
                Analyze skincare ingredients, their benefits,
                suitable skin types and possible warnings.
              </p>

              <button onClick={onIngredientAssessment}>
                Analyze Ingredients →
              </button>
            </div>

          </div>


          {/* Product Recommendations */}
          <div className="dashboard-card">

            <div className="card-icon">🛍️</div>

            <div className="card-content">
              <h3>Product Recommendations</h3>

              <p>
                Explore skincare products based on your skin
                concerns, ingredients and skin type.
              </p>

              <button onClick={onProductRecommendations}>
                View Products →
              </button>
            </div>

          </div>
        {/* Book Consultation */}
<div className="dashboard-card">
  <div className="card-icon">🩺</div>

  <div className="card-content">
    <h3>Book Consultation</h3>

    <p>
      Schedule a consultation with a skincare consultant
      or dermatologist for personalized guidance.
    </p>

    <button onClick={onBookConsultation}>
      Book Consultation →
    </button>
  </div>
</div>
        </div>

      </main>

    </div>
  );
}

export default Dashboard;
