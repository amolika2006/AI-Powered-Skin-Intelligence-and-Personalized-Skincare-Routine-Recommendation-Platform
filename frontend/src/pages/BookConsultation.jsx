import "./BookConsultation.css";
import { useEffect, useState } from "react";

function BookConsultation({ onBackToDashboard }) {
  const [consultants, setConsultants] = useState([]);
  const [consultantId, setConsultantId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/consultants")
      .then((response) => response.json())
      .then((data) => {
        setConsultants(data.consultants || []);
      })
      .catch((error) => {
        console.error("Consultant loading error:", error);
      });
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      return;
    }

    if (!consultantId || !date) {
      alert("Please select a consultant and consultation date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/user/consultations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            consultant_id: Number(consultantId),
            consultation_date: date,
            notes: notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Booking failed");
      }

      alert("Consultation booked successfully!");

      setConsultantId("");
      setDate("");
      setNotes("");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Unable to book consultation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">

        {/* Back Button */}
        <button
  type="button"
  className="back-button"
  onClick={onBackToDashboard}
>
  ← Back to Dashboard
</button>

        <h1>Book a Consultation</h1>

        <p>
          Schedule a consultation with a skincare consultant or dermatologist.
        </p>

        <form onSubmit={handleBooking}>
          <label>Select Consultant</label>

          <select
            value={consultantId}
            onChange={(e) => setConsultantId(e.target.value)}
            required
          >
            <option value="">Choose a consultant</option>

            {consultants.map((consultant) => (
              <option key={consultant.id} value={consultant.id}>
                {consultant.name} — {consultant.role}
              </option>
            ))}
          </select>

          <label>Consultation Date &amp; Time</label>

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Notes</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your skin concerns..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Consultation"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookConsultation;
