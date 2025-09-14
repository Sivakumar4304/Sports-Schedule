"use client";

import { useState, useEffect } from "react";

export default function EditSessionModal({ isOpen, onClose, session, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sport: "",
    dateTime: "",
    location: "",
    maxParticipants: 10,
  });

  // Pre-fill form when session changes
  useEffect(() => {
    if (session) {
      setFormData({
        name: session.name || "",
        description: session.description || "",
        sport: session.sport || "",
        dateTime: session.dateTime
          ? new Date(session.dateTime).toISOString().slice(0, 16) // for datetime-local input
          : "",
        location: session.location || "",
        maxParticipants: session.maxParticipants || 10,
      });
    }
  }, [session]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          width: "400px",
          maxWidth: "90%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.75rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#111827",
          }}
        >
          Edit Session
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {[
            "name",
            "description",
            "sport",
            "dateTime",
            "location",
            "maxParticipants",
          ].map((field) => (
            <input
              key={field}
              type={
                field === "dateTime"
                  ? "datetime-local"
                  : field === "maxParticipants"
                  ? "number"
                  : "text"
              }
              name={field}
              placeholder={field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              value={formData[field]}
              onChange={handleInputChange}
              required={field === "name" || field === "dateTime"}
              min={field === "maxParticipants" ? 1 : undefined}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "0.95rem",
                fontFamily: "Source Sans Pro, sans-serif",
                transition: "all 0.2s ease-in-out",
              }}
            />
          ))}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "8px",
                background: "#4f46e5",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "8px",
                background: "#e5e7eb",
                color: "#111827",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
