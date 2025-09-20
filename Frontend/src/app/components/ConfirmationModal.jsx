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
  const actionClass = actionType === "join" ? "confirm" : "leave";

  return createPortal(
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <h2 className="modal-title">{actionText} Session</h2>

          <p className="modal-text">
            Are you sure you want to {actionText.toLowerCase()}{" "}
            <strong>{sessionName}</strong>?
          </p>

          <div className="modal-actions">
            <button onClick={onConfirm} className={`modal-btn ${actionClass}`}>
              Yes, {actionText}
            </button>
            <button onClick={onClose} className="modal-btn cancel">
              Cancel
            </button>
          </div>
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
          text-align: center;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .modal-title {
          font-family: "Playfair Display", serif;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
        }

        .modal-text {
          font-family: "Source Sans Pro", sans-serif;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: #374151;
        }

        .modal-actions {
          display: flex;
          gap: 0.5rem;
        }

        .modal-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .modal-btn.confirm {
          background: #10b981;
          color: #fff;
        }

        .modal-btn.confirm:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .modal-btn.leave {
          background: #ef4444;
          color: #fff;
        }

        .modal-btn.leave:hover {
          background: #dc2626;
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
    </>,
    document.body
  );
}
