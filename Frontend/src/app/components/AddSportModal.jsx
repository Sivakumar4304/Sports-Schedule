"use client";
import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiX, FiCheck, FiXCircle } from "react-icons/fi";
import Toast from "./Toast";
import "../styles/AddSportModal.css";

export default function AddSportModal({ isOpen, onClose }) {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isOpen) fetchSports();
  }, [isOpen]);

  const fetchSports = async () => {
    try {
      const res = await fetch("http://localhost:8080/sports", {
        credentials: "include",
      });
      const data = await res.json();
      setSports(data.sports || []);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to fetch sports" });
    }
  };

  const handleAddSport = async () => {
    if (!newSport.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newSport }),
      });
      const data = await res.json();
      if (res.ok) {
        setSports((prev) => [...prev, data.sport]);
        setNewSport("");
        setToast({ type: "success", message: "Sport added!" });
      } else {
        setToast({
          type: "error",
          message: data.error || "Failed to add sport",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Something went wrong" });
    }
  };

  const handleEditSport = async (id) => {
    if (!editValue.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/sports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: editValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setSports((prev) => prev.map((s) => (s._id === id ? data.sport : s)));
        setEditingId(null);
        setEditValue("");
        setToast({ type: "success", message: "Sport updated!" });
      } else {
        setToast({
          type: "error",
          message: data.error || "Failed to update sport",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSport = async (id) => {
    if (!confirm("Are you sure you want to delete this sport?")) return;

    try {
      const res = await fetch(`http://localhost:8080/sports/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setSports((prev) => prev.filter((s) => s._id !== id));
        setToast({ type: "success", message: "Sport deleted!" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close-btn" onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2 className="modal-title">Manage Sports</h2>

        {/* Add Sport */}
        <div className="modal-add-sport">
          <input
            type="text"
            placeholder="New Sport Name"
            value={newSport}
            onChange={(e) => setNewSport(e.target.value)}
          />
          <button onClick={handleAddSport}>Add</button>
        </div>

        {/* Sports List */}
        <ul className="modal-sports-list">
          {sports.map((sport) => (
            <li key={sport._id} className="modal-sport-item">
              {editingId === sport._id ? (
                <>
                  <input
                    className="edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <div className="modal-sport-actions">
                    <button onClick={() => handleEditSport(sport._id)}>
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditValue("");
                      }}
                    >
                      <FiXCircle />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{sport.name}</span>
                  <div className="modal-sport-actions">
                    <button
                      onClick={() => {
                        setEditingId(sport._id);
                        setEditValue(sport.name);
                      }}
                    >
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDeleteSport(sport._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
