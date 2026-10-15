
import { useState } from "react";
import "../App.css";

function Login({ onLoginSuccess, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    // Temporary frontend login.
    // Connect backend authentication here.
    const normalizedRole = role.toLowerCase().trim();
    const userId = localStorage.getItem("userId") || "1";

    if (onLoginSuccess) {
      onLoginSuccess(userId, normalizedRole);
    }
  };

  return (
    <div className="skin-auth-page">
      {/* LEFT SIDE */}
      <section className="skin-auth-left">
        <div className="brand">
          <div className="brand-mark">✿</div>

          <div>
            <h2>AI Skin Intelligence</h2>
            <p>Smarter Skincare. Healthier You.</p>
          </div>
        </div>

        <div className="hero-content">
          <span className="ai-label">
            PERSONALIZED SKINCARE POWERED BY AI
          </span>

          <h1>
            Healthy Skin
            <br />
            Builds Confidence
            <br />
            <span>You.</span>
          </h1>

          <p className="hero-description">
            Discover a smarter way to care for your skin.
            Get personalized insights, skincare recommendations,
            and routines designed around your unique needs.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">✧</div>

              <div>
                <h3>AI Skin Analysis</h3>
                <p>
                  Understand your skin type and identify
                  your skincare concerns.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">♡</div>

              <div>
                <h3>Personalized Routines</h3>
                <p>
                  Get skincare suggestions tailored to your
                  skin goals and daily habits.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">▥</div>

              <div>
                <h3>Track Your Progress</h3>
                <p>
                  Monitor your skincare journey and maintain
                  consistent care.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="skin-ai-card">
          <div className="ai-card-top">
            <span>YOUR SKIN JOURNEY</span>
            <span>✧ AI INSIGHTS</span>
          </div>

          <div className="skin-score">
            <div className="score-circle">
              <strong>AI</strong>
              <span>CARE</span>
            </div>

            <div>
              <h3>Your glow starts here</h3>
              <p>
                Personalized skincare, one step at a time.
              </p>
            </div>
          </div>

          <div className="skin-tags">
            <span>Hydration</span>
            <span>Daily care</span>
            <span>Skin health</span>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="skin-auth-right">
        <div className="login-box">
          <div className="mobile-brand">
            <div className="brand-mark">✿</div>
            <span>AI Skin Intelligence</span>
          </div>

          <div className="login-heading">
            <span className="welcome-label">WELCOME BACK</span>

            <h2>Welcome Back!</h2>

            <p>
              Sign in to continue your personalized
              skincare journey.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="modern-form-group">
              <label htmlFor="login-email">Email Address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="modern-form-group">
              <label htmlFor="login-password">Password</label>

              <div className="input-wrapper">
                <span className="input-icon">♙</span>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="modern-form-group">
              <label htmlFor="login-role">Select Role</label>

              <div className="input-wrapper">
                <span className="input-icon">♧</span>

                <select
                  id="login-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="consultant">
                    Skincare Consultant
                  </option>
                  <option value="dermatologist">
                    Dermatologist
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="modern-login-button"
            >
              Sign In <span>→</span>
            </button>
          </form>

          <div className="secure-note">
            ♡ Your information is safe and secure.
          </div>

          <p className="create-account-text">
            Don't have an account?

            <button
              type="button"
              onClick={onCreateAccount}
            >
              Create Account
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;