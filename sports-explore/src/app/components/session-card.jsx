"use client";

import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal"; // <-- new modal for join/leave

export default function SessionCard({
  session,
  type = "available",
  onJoin,
  onEdit,
  onDelete,
  onLeave,
  currentUserId,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const handleConfirm = async () => {
    try {
      if (modalAction === "join") {
        await onJoin?.(session);
      } else if (modalAction === "leave") {
        await onLeave?.(session);
      }
    } finally {
      setModalOpen(false);
    }
  };

  const getActionButtons = () => {
    if (type === "createdByMe") {
      return (
        <div
          style={{
            backgroundColor: "#3b82f6", // blue-500
            color: "#ffffff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            textAlign: "center",
            cursor: "default",
          }}
        >
          Session created by you
        </div>
      );
    }

    if (type === "alreadyJoined") {
      return (
        <div
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            backgroundColor: "#10b981", // green-500
            color: "#fff",
            fontWeight: "600",
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          Already joined
        </div>
      );
    }
    switch (type) {
      case "created":
        return (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => onEdit?.(session)}>
              Edit
            </button>
            <button
              className="btn-destructive"
              onClick={() => onDelete?.(session)}
            >
              Delete
            </button>
          </div>
        );

      case "joined":
        return (
          <button
            className="btn-destructive"
            onClick={() => {
              setModalAction("leave");
              setModalOpen(true);
            }}
          >
            Leave
          </button>
        );

      case "available":
      default:
        return (
          <button
            className="btn-accent"
            onClick={() => {
              setModalAction("join");
              setModalOpen(true);
            }}
          >
            Join Session
          </button>
        );
    }
  };

  return (
    <div className="session-card" style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h3
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.25rem",
            fontWeight: "700",
            margin: "0 0 0.5rem 0",
            color: "var(--card-foreground)",
          }}
        >
          {session.name}
        </h3>
        <p
          style={{
            fontFamily: "Source Sans Pro, sans-serif",
            fontSize: "0.9rem",
            color: "var(--muted-foreground)",
            margin: "0 0 1rem 0",
          }}
        >
          {session.description}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Sport
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--card-foreground)",
            }}
          >
            {session.sport}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Date & Time
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--card-foreground)",
            }}
          >
            {session.dateTime}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Participants
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--card-foreground)",
            }}
          >
            {session.participants?.length || 0}/{session.maxParticipants}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Location
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--card-foreground)",
            }}
          >
            {session.location}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {getActionButtons()}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        actionType={modalAction}
        sessionName={session.name}
      />
    </div>
  );
}
