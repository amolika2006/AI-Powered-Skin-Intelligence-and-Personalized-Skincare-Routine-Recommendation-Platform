import { useState } from "react";
import "./SleepTracking.css";

function SleepTracking({ onBackToDashboard }) {
  const [sleepData, setSleepData] = useState({
    sleepTime: "",
    wakeTime: "",
    duration: "",
    quality: "",
    interruptions: "No",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setSleepData({
      ...sleepData,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/sleep",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(localStorage.getItem("userId")),
            sleep_time: sleepData.sleepTime,
            wake_time: sleepData.wakeTime,
            duration: sleepData.duration,
            quality: sleepData.quality,
            interruptions: sleepData.interruptions,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        console.log(data);
      } else {
        alert("Failed to save sleep information");
        console.log(data);
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="sleep-page">

      <div className="sleep-container">

        {/* HEADER */}

        <div className="sleep-header">

          <div className="sleep-header-icon">
            😴
          </div>

          <div>
            <span className="sleep-label">
              AI SKIN INTELLIGENCE
            </span>

            <h1>Sleep Tracking</h1>

            <p>
              Monitor your sleep patterns and quality to understand
              how your daily wellness supports your skincare journey.
            </p>
          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* SLEEP SCHEDULE */}

          <section className="sleep-section">

            <div className="section-title">

              <span className="section-number">
                01
              </span>

              <div>
                <h2>Sleep Schedule</h2>

                <p>
                  Tell us about your usual sleeping and waking time.
                </p>
              </div>

            </div>


            <div className="sleep-grid">

              <div className="sleep-field">

                <label>
                  Usual Sleep Time
                </label>

                <input
                  type="time"
                  name="sleepTime"
                  value={sleepData.sleepTime}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="sleep-field">

                <label>
                  Usual Wake-up Time
                </label>

                <input
                  type="time"
                  name="wakeTime"
                  value={sleepData.wakeTime}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>


          {/* SLEEP QUALITY */}

          <section className="sleep-section">

            <div className="section-title">

              <span className="section-number">
                02
              </span>

              <div>
                <h2>Sleep Quality</h2>

                <p>
                  Record your average sleep duration and quality.
                </p>
              </div>

            </div>


            <div className="sleep-grid">

              <div className="sleep-field">

                <label>
                  Average Sleep Duration
                </label>

                <select
                  name="duration"
                  value={sleepData.duration}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select sleep duration
                  </option>

                  <option value="Less than 5 hours">
                    Less than 5 hours
                  </option>

                  <option value="5-6 hours">
                    5 - 6 hours
                  </option>

                  <option value="6-7 hours">
                    6 - 7 hours
                  </option>

                  <option value="7-8 hours">
                    7 - 8 hours
                  </option>

                  <option value="More than 8 hours">
                    More than 8 hours
                  </option>
                </select>

              </div>


              <div className="sleep-field">

                <label>
                  Sleep Quality
                </label>

                <select
                  name="quality"
                  value={sleepData.quality}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select sleep quality
                  </option>

                  <option value="Poor">
                    Poor
                  </option>

                  <option value="Fair">
                    Fair
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Excellent">
                    Excellent
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* INTERRUPTIONS */}

          <section className="sleep-section">

            <div className="section-title">

              <span className="section-number">
                03
              </span>

              <div>
                <h2>Sleep Interruptions</h2>

                <p>
                  Let us know how frequently your sleep is interrupted.
                </p>
              </div>

            </div>


            <div className="sleep-field">

              <label>
                Night-time Interruptions
              </label>

              <select
                name="interruptions"
                value={sleepData.interruptions}
                onChange={handleChange}
              >
                <option value="No">
                  No
                </option>

                <option value="Sometimes">
                  Sometimes
                </option>

                <option value="Frequently">
                  Frequently
                </option>
              </select>

            </div>

          </section>


          {/* SUCCESS */}

          {saved && (
            <div className="sleep-success">

              <span>✓</span>

              <div>
                <strong>
                  Sleep information saved
                </strong>

                <p>
                  Your sleep record has been successfully added.
                </p>
              </div>

            </div>
          )}


          {/* ACTIONS */}

          <div className="sleep-actions">

            <button
              type="button"
              className="sleep-back"
              onClick={onBackToDashboard}
            >
              ← Back to Dashboard
            </button>

            <button
              type="submit"
              className="sleep-save"
            >
              😴 Save Sleep Information
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SleepTracking;