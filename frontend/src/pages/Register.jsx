import { useState } from "react";

function Register({ onBackToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      alert("Account created successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });

      onBackToLogin();

    } catch (error) {
      console.error(error);
      alert(
        "Cannot connect to backend. Please make sure FastAPI is running."
      );
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SECTION */}
      <div className="auth-left">

        <div className="brand-section">
          <div className="brand-icon">✦</div>

          <div>
            <h2>AI Skin Intelligence</h2>
            <p>Smart skincare. Personalized for you.</p>
          </div>
        </div>

        <div className="hero-content">

          <div className="eyebrow">
            ✨ AI-POWERED SKINCARE
          </div>

          <h1>
            Start your
            <br />
            <span>personalized journey.</span>
          </h1>

          <p className="hero-description">
            Create your account and get personalized skincare
            insights, intelligent recommendations and progress
            tracking powered by AI.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div>
                <strong>Personalized Analysis</strong>
                <p>Understand your unique skin concerns.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">♡</div>
              <div>
                <strong>Smart Recommendations</strong>
                <p>Discover products suited to your skin.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">↗</div>
              <div>
                <strong>Track Your Progress</strong>
                <p>Monitor your skin health over time.</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="auth-right">

        <div className="register-form-container">

          <div className="welcome-label">
            GET STARTED
          </div>

          <h1>Create your account</h1>

          <p className="form-subtitle">
            Begin your personalized skincare journey.
          </p>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="form-group">
              <label>Full Name</label>

              <div className="input-wrapper">
                <span className="input-icon">◉</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span className="input-icon">●</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label>Confirm Password</label>

              <div className="input-wrapper">
                <span className="input-icon">●</span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ACCOUNT TYPE */}
            <div className="form-group">
              <label>Account Type</label>

              <div className="input-wrapper select-wrapper">
                <span className="input-icon">◎</span>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">
                    User
                  </option>

                  <option value="consultant">
                    Skincare Consultant
                  </option>

                  <option value="dermatologist">
                    Dermatologist
                  </option>

                  <option value="admin">
                    Administrator
                  </option>
                </select>
              </div>
            </div>

            {/* BUTTON */}
            <button
  type="button"
  className="auth-submit-button"
  onClick={handleSubmit}
>
  Create Account
  <span>→</span>
</button>

          </form>

          <div className="security-message">
            🔒 Your information is securely protected.
          </div>

          <div className="switch-auth">
            Already have an account?

            <button
              type="button"
              onClick={onBackToLogin}
            >
              Sign In
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;