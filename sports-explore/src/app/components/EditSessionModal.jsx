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

  useEffect(() => {
    if (session) {
      setFormData({
        name: session.name || "",
        description: session.description || "",
        sport: session.sport || "",
        dateTime: session.dateTime
          ? new Date(session.dateTime).toISOString().slice(0, 16)
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
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <h2 className="modal-title">Edit Session</h2>

          <form className="modal-form" onSubmit={handleSubmit}>
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
                className="modal-input"
              />
            ))}

            <div className="modal-actions">
              <button type="submit" className="modal-btn save">
                Save
              </button>
              <button type="button" onClick={onClose} className="modal-btn cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-box {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .modal-title {
          font-family: "Playfair Display", serif;
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #111827;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-input {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 0.95rem;
          font-family: "Source Sans Pro", sans-serif;
          transition: all 0.2s ease-in-out;
        }

        .modal-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }

        .modal-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .modal-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn.save {
          background: #4f46e5;
          color: #fff;
        }

        .modal-btn.save:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }

        .modal-btn.cancel {
          background: #e5e7eb;
          color: #111827;
        }

        .modal-btn.cancel:hover {
          background: #d1d5db;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
