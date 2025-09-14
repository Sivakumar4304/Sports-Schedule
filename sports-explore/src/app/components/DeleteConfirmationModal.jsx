"use client";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  sessionName,
}) {
  if (!isOpen) return null;

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
          Delete Session
        </h2>
        <p
          style={{
            fontFamily: "Source Sans Pro, sans-serif",
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          Are you sure you want to delete <strong>{sessionName}</strong>?
        </p>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "8px",
              background: "#ef4444",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
            }}
          >
            Yes, Delete
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
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
