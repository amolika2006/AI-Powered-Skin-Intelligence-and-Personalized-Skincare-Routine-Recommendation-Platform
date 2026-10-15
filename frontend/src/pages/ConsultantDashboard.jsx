import React, { useEffect, useState } from "react";
import "./ConsultantDashboard.css";

function ConsultantDashboard({ onBackToDashboard }) {
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [assessments, setAssessments] = useState([]);
    const [loadingAssessments, setLoadingAssessments] = useState(true);
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    const [guidance, setGuidance] = useState("");
    const [savedGuidance, setSavedGuidance] = useState([]);

    const [consultations, setConsultations] = useState([]);
    const [loadingConsultations, setLoadingConsultations] = useState(true);

    const handleBackToDashboard = () => {
  setSelectedAssessment(null);
  setSelectedPatient(null);
  setGuidance("");
};

useEffect(() => {
  fetch("http://127.0.0.1:8000/consultant/patients")
    .then((response) => response.json())
    .then((data) => {
      setPatients(data.patients || []);
      setLoadingPatients(false);
    })
    .catch((error) => {
      console.error("Patient loading error:", error);
      setLoadingPatients(false);
    });

    fetch("http://127.0.0.1:8000/consultant/assessments")
  .then((response) => response.json())
  .then((data) => {
    setAssessments(data.assessments || []);
    setLoadingAssessments(false);
  })
  .catch((error) => {
    console.error("Assessment loading error:", error);
    setLoadingAssessments(false);
  });

  fetch("http://127.0.0.1:8000/consultant/consultations")
  .then((response) => response.json())
  .then((data) => {
    setConsultations(data.consultations || []);
    setLoadingConsultations(false);
  })
  .catch((error) => {
    console.error("Consultation loading error:", error);
    setLoadingConsultations(false);
  });
}, []);

useEffect(() => {
      if (!selectedPatient) return;

  fetch(`http://127.0.0.1:8000/consultant/guidance/${selectedPatient.id}`)
    .then((response) => response.json())
    .then((data) => {
      setSavedGuidance(data.guidance || []);
    })
    .catch((error) => {
      console.error("Guidance loading error:", error);
    });
}, [selectedPatient]);

if (selectedAssessment) {
  return (
    <div className="consultant-dashboard">
      <div className="consultant-header">
        <div>
          <span className="dashboard-badge">SKIN ASSESSMENT</span>
          <h1>{selectedAssessment.name}</h1>
          <p>Detailed patient skin assessment.</p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => setSelectedAssessment(null)}
        >
          ← Back to Assessments
        </button>
      </div>

      <div className="patient-profile-card">
        <h2>Assessment Results</h2>

        <p>
          <strong>Email:</strong> {selectedAssessment.email}
        </p>

        <p>
          <strong>Overall Score:</strong> {selectedAssessment.score}
        </p>

        <p>
          <strong>Result:</strong> {selectedAssessment.result}
        </p>

        <hr />

        <h3>Skin Concerns</h3>

        <p>Acne: {selectedAssessment.acne}</p>
        <p>Dryness: {selectedAssessment.dryness}</p>
        <p>Oiliness: {selectedAssessment.oiliness}</p>
        <p>Redness: {selectedAssessment.redness}</p>
        <p>Pigmentation: {selectedAssessment.pigmentation}</p>
        <p>Sensitivity: {selectedAssessment.sensitivity}</p>
      </div>
    </div>
  );
}
if (selectedPatient) {
  return (
    <div className="consultant-dashboard">
      <div className="consultant-header">
        <div>
          <span className="dashboard-badge">SKINCARE GUIDANCE</span>
          <h1>{selectedPatient.name}</h1>
          <p>Provide personalized skincare guidance for this patient.</p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => setSelectedPatient(null)}
        >
          ← Back
        </button>
      </div>

      <div className="guidance-card">
        <h2>Personalized Skincare Guidance</h2>

        <p>
          <strong>Patient:</strong> {selectedPatient.name}
        </p>

        <p>
          <strong>Skin Type:</strong> {selectedPatient.skin_type}
        </p>

        <p>
          <strong>Concerns:</strong> {selectedPatient.concerns}
        </p>
        {savedGuidance.length > 0 && (
  <div className="saved-guidance">
    <h3>Previous Guidance</h3>

    {savedGuidance.map((item, index) => (
      <div className="saved-guidance-item" key={index}>
        <p>{item.guidance}</p>
        <small>
          {new Date(item.created_at).toLocaleString()}
        </small>
      </div>
    ))}
  </div>
)}


        <label>Consultant Guidance</label>

        <textarea
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          placeholder="Enter personalized skincare advice..."
          rows="7"
        />

        <button
          className="save-guidance-btn"
          onClick={async () => {
  if (!guidance.trim()) {
    alert("Please enter guidance first.");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/consultant/guidance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: selectedPatient.id,
          guidance: guidance,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to save guidance");
    }

    alert("Guidance saved successfully.");
    setGuidance("");
  } catch (error) {
    console.error("Guidance save error:", error);
    alert("Unable to save guidance.");
  }
}}
        >
          Save Guidance
        </button>
      </div>
    </div>
  );
}
  return (
    <div className="consultant-dashboard">
      <div className="consultant-header">
        <div>
          <span className="dashboard-badge">PROFESSIONAL PANEL</span>
          <h1>Consultant Dashboard</h1>
          <p>
            Manage patient assessments, skin profiles and personalized
            skincare guidance.
          </p>
        </div>
      <button
  type="button"
  className="back-dashboard-btn"
  onClick={handleBackToDashboard}
>
  ← Back to Dashboard
</button>
      </div>

      <div className="consultant-stats">
        <div className="consultant-stat-card">
          <span>👥</span>
          <h3>Patients</h3>
          <strong>{patients.length}</strong>
          <p>Registered patients</p>
        </div>

        <div className="consultant-stat-card">
          <span>🧴</span>
          <h3>Skin Assessments</h3>
          <strong>{assessments.length}</strong>
          <p>Patient assessments</p>
        </div>

        <div className="consultant-stat-card">
          <span>📋</span>
          <h3>Consultations</h3>
          <strong>0</strong>
          <p>Pending consultations</p>
        </div>

        <div className="consultant-stat-card">
          <span>⭐</span>
          <h3>Rating</h3>
          <strong>5.0</strong>
          <p>Professional rating</p>
        </div>
      </div>
      <div className="consultant-section">
  <h2>Patient Profiles</h2>

  {loadingPatients ? (
    <p>Loading patients...</p>
  ) : patients.length === 0 ? (
    <p>No registered patients found.</p>
  ) : (
    <div className="patient-list">
      {patients.map((patient) => (
        <div className="patient-card" key={patient.id}>
          <div className="patient-avatar">👤</div>

          <div className="patient-info">
            <h3>{patient.name}</h3>
            <p>{patient.email}</p>

            <div className="patient-details">
              <span>Skin: {patient.skin_type}</span>
              <span>Age: {patient.age_group}</span>
              <span>Concerns: {patient.concerns}</span>
            </div>
          </div>

          <button
  className="view-patient-btn"
  onClick={() => setSelectedPatient(patient)}
>
  View Profile →
</button>
        </div>
      ))}
    </div>
  )}
</div>
<div className="consultant-section">
  <h2>Skin Assessment Reviews</h2>

  {loadingAssessments ? (
    <p>Loading assessments...</p>
  ) : assessments.length === 0 ? (
    <p>No patient assessments found.</p>
  ) : (
    <div className="assessment-list">
      {assessments.map((assessment) => (
        <div className="assessment-card" key={assessment.id}>
          <div className="assessment-icon">🔬</div>

          <div className="assessment-info">
            <h3>{assessment.name}</h3>
            <p>{assessment.email}</p>

            <div className="assessment-details">
              <span>Score: {assessment.score}</span>
              <span>Result: {assessment.result}</span>
            </div>
          </div>

          <button
            className="view-assessment-btn"
            onClick={() => setSelectedAssessment(assessment)}
          >
            Review →
          </button>
        </div>
      ))}
    </div>
  )}
</div>
<div className="consultant-section"
     id="consultations-section"
     >

  <h2>Consultations</h2>

  {loadingConsultations ? (
    <p>Loading consultations...</p>
  ) : consultations.length === 0 ? (
    <p>No consultations found.</p>
  ) : (
    <div className="consultation-list">
      {consultations.map((consultation) => (
        <div className="consultation-card" key={consultation.id}>
          <div className="consultation-icon">📅</div>

          <div className="consultation-info">
            <h3>{consultation.patient_name}</h3>

            <p>{consultation.patient_email}</p>

            <div className="consultation-details">
              <span>
                Date:{" "}
                {new Date(
                  consultation.consultation_date
                ).toLocaleString()}
              </span>

<div className="consultation-status-control">
  <label htmlFor={`status-${consultation.id}`}>
    Consultation Status
  </label>

  <select
    id={`status-${consultation.id}`}
    value={consultation.status || "pending"}
    onChange={async (e) => {
      const newStatus = e.target.value;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/consultant/consultations/${consultation.id}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to update status"
          );
        }

        setConsultations((previous) =>
          previous.map((item) =>
            item.id === consultation.id
              ? { ...item, status: data.status }
              : item
          )
        );

        alert("Consultation status updated successfully.");
      } catch (error) {
        console.error("Status update error:", error);
        alert("Unable to update consultation status.");
      }
    }}
  >
    <option value="pending">Pending</option>
    <option value="confirmed">Confirmed</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </select>
</div>

              {consultation.consultant_name && (
                <span>
                  Consultant: {consultation.consultant_name}
                </span>
              )}
            </div>

            {consultation.notes && (
              <p className="consultation-notes">
                <strong>Notes:</strong> {consultation.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      <div className="consultant-section">
        <h2>Professional Tools</h2>

        <div className="consultant-tools">
          <div className="consultant-tool-card">
            <div className="tool-icon">👤</div>
            <h3>Patient Profiles</h3>
            <p>
              View patient skin profiles, concerns, allergies and
              lifestyle information.
            </p>
            <button
  onClick={() => {
    document
      .querySelector(".patient-list")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  View Patients →
</button>
          </div>

          <div className="consultant-tool-card">
            <div className="tool-icon">🔬</div>
            <h3>Skin Assessments</h3>
            <p>
              Review patient skin assessments and identified skin
              concerns.
            </p>
            <button
  onClick={() => {
    document
      .querySelector(".assessment-list")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Review Assessments →
</button>
          </div>

          <div className="consultant-tool-card">
            <div className="tool-icon">💊</div>
            <h3>Skincare Guidance</h3>
            <p>
              Provide personalized skincare recommendations based on
              patient needs.
            </p>
            <button
  onClick={() => setSelectedPatient(patients[0])}
>
  Provide Guidance →
</button>
          </div>

          <div className="consultant-tool-card">
            <div className="tool-icon">📅</div>
            <h3>Consultations</h3>
            <p>
              Manage upcoming and pending patient consultations.
            </p>
            <button
  type="button"
  onClick={() => {
    const section = document.getElementById("consultations-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }}
>
  Manage Consultations →
</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultantDashboard;
