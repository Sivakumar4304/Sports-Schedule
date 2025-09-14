"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  sessionName,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const actionText = actionType === "join" ? "Join" : "Leave";
  const actionColor = actionType === "join" ? "#10b981" : "#ef4444";

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
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
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.5rem",
            marginBottom: "1rem",
            color: "#111827",
          }}
        >
          {actionText} Session
        </h2>

        <p
          style={{
            fontFamily: "Source Sans Pro, sans-serif",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            color: "#374151",
          }}
        >
          Are you sure you want to {actionText.toLowerCase()}{" "}
          <strong>{sessionName}</strong>?
        </p>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "8px",
              background: actionColor,
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            Yes, {actionText}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "8px",
              background: "#e5e7eb",
              color: "#111827",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
