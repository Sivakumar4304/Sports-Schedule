"use client";

import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

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
      if (modalAction === "join") await onJoin?.(session);
      else if (modalAction === "leave") await onLeave?.(session);
    } finally {
      setModalOpen(false);
    }
  };

  const getActionButtons = () => {
    if (type === "createdByMe") {
      return <div className="badge blue">Session created by you</div>;
    }

    if (type === "alreadyJoined") {
      return <div className="badge green">Already joined</div>;
    }

    switch (type) {
      case "created":
        return (
          <div className="action-buttons">
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
    <div className="session-card">
      <div className="session-header">
        <h3>{session.name}</h3>
        <p>{session.description}</p>
      </div>

      <div className="session-details">
        <div>
          <div className="detail-label">Sport</div>
          <div className="detail-value">{session.sport}</div>
        </div>
        <div>
          <div className="detail-label">Date & Time</div>
          <div className="detail-value">{session.dateTime}</div>
        </div>
        <div>
          <div className="detail-label">Participants</div>
          <div className="detail-value">
            {session.participants?.length || 0}/{session.maxParticipants}
          </div>
        </div>
        <div>
          <div className="detail-label">Location</div>
          <div className="detail-value">{session.location}</div>
        </div>
      </div>

      <div className="session-actions">{getActionButtons()}</div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        actionType={modalAction}
        sessionName={session.name}
      />

      <style jsx>{`
        .session-card {
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          background: #fff;
        }

        .session-header h3 {
          font-family: "Playfair Display", serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #111827;
        }

        .session-header p {
          font-family: "Source Sans Pro", sans-serif;
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0 0 1rem 0;
        }

        .session-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111827;
        }

        .session-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-align: center;
        }

        .badge.blue {
          background-color: #3b82f6;
          color: #fff;
        }

        .badge.green {
          background-color: #10b981;
          color: #fff;
        }

        .btn-primary,
        .btn-accent,
        .btn-destructive {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #3b82f6;
          color: #fff;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-accent {
          background: #4f46e5;
          color: #fff;
        }

        .btn-accent:hover {
          background: #4338ca;
        }

        .btn-destructive {
          background: #ef4444;
          color: #fff;
        }

        .btn-destructive:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}
