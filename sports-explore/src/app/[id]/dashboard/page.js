"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/navbar";
import SessionCard from "../../components/session-card";
import EditSessionModal from "../../components/EditSessionModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Toast from "../../components/Toast";

export default function Dashboard() {
  const { id } = useParams();

  const [sessions, setSessions] = useState({
    created: [],
    joined: [],
    available: [],
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDeleteSession, setSelectedDeleteSession] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/sessions/my-sessions/", {
          credentials: "include",
        });

        if (res.status === 401) {
          // Save toast for login page
          localStorage.setItem(
            "toastMessage",
            JSON.stringify({ type: "error", message: "You must be logged in" })
          );
          window.location.href = "/login";
          return;
        }

        const userData = await res.json();

        // Fetch available sessions
        const resAvailable = await fetch(
          "http://localhost:8080/sessions/available",
          {
            credentials: "include",
          }
        );
        const availableData = await resAvailable.json();
        console.log(availableData);

        setSessions({
          created: userData.created || [],
          joined: userData.joined || [],
          available: availableData.available || [],
        });
        setCurrentUserId(userData.userId);
        setCurrentUserName(userData.userName || "Guest");
        setCurrentUserRole(userData.userRole);
        console.log(currentUserRole);
      } catch (err) {
        console.error("Error fetching sessions", err);
        setToast({ type: "error", message: "Failed to load sessions" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ---------- CRUD ACTIONS ---------- */

  const handleEditClick = (session) => {
    setSelectedSession(session);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const res = await fetch(
        `http://localhost:8080/sessions/${selectedSession._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to update session");

      const updated = await res.json();
      setSessions((prev) => ({
        ...prev,
        created: prev.created.map((s) => (s._id === updated._id ? updated : s)),
      }));

      setIsEditOpen(false);
      setToast({ type: "success", message: "Session updated successfully!" });
    } catch (err) {
      console.error("Edit failed:", err);
      setToast({ type: "error", message: "Failed to update session" });
    }
  };

  const handleDeleteClick = (session) => {
    setSelectedDeleteSession(session);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/sessions/${selectedDeleteSession._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Delete failed");

      setSessions((prev) => ({
        created: prev.created.filter(
          (s) => s._id !== selectedDeleteSession._id
        ),
        joined: prev.joined.filter((s) => s._id !== selectedDeleteSession._id),
        available: prev.available.filter(
          (s) => s._id !== selectedDeleteSession._id
        ),
      }));

      setIsDeleteOpen(false);
      setToast({ type: "success", message: "Session deleted successfully!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to delete session" });
    }
  };

  /* ---------- JOIN / LEAVE ACTIONS ---------- */

  const handleJoin = async (session) => {
    try {
      const res = await fetch(
        `http://localhost:8080/sessions/${session._id}/join`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to join session");

      const data = await res.json();
      const joinedSession = data.session;

      setSessions((prev) => ({
        ...prev,
        joined: [...prev.joined, joinedSession],
        available: prev.available.filter((s) => s._id !== session._id),
      }));

      setToast({ type: "success", message: "Successfully joined session!" });
    } catch (err) {
      console.error("Join failed:", err);
      setToast({ type: "error", message: "Failed to join session" });
    }
  };

  const handleLeave = async (session) => {
    try {
      const res = await fetch(
        `http://localhost:8080/sessions/${session._id}/leave`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to leave session");

      const data = await res.json();
      const leftSession = data.session;

      setSessions((prev) => ({
        ...prev,
        joined: prev.joined.filter((s) => s._id !== session._id),
        available: [...prev.available, leftSession],
      }));

      setToast({ type: "success", message: "You left the session." });
    } catch (err) {
      console.error("Leave failed:", err);
      setToast({ type: "error", message: "Failed to leave session" });
    }
  };

  /* ---------- CREATE SESSION HANDLER ---------- */
  const handleSessionCreated = (newSession, errorMessage) => {
    if (newSession) {
      setSessions((prev) => ({
        ...prev,
        created: [...prev.created, newSession],
        available: [
          ...prev.available,
          {
            ...newSession,
            createdBy: { _id: currentUserId, name: currentUserName },
          },
        ], // add to available too
      }));

      setToast({ type: "success", message: "Session created successfully!" });
    } else {
      setToast({
        type: "error",
        message: errorMessage || "Failed to create session",
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar
        currentUser={currentUserName}
        currentUserRole={currentUserRole}
        onSessionCreated={handleSessionCreated}
      />

      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        {/* Created */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 className="section-title">
            My Created Sessions ({sessions.created.length})
          </h2>
          <div className="dashboard-grid">
            {sessions.created.length > 0 ? (
              sessions.created.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  type="created"
                  onEdit={() => handleEditClick(session)}
                  onDelete={() => handleDeleteClick(session)}
                />
              ))
            ) : (
              <p>No sessions created.</p>
            )}
          </div>
        </section>

        {/* Joined */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 className="section-title">
            My Joined Sessions ({sessions.joined.length})
          </h2>
          <div className="dashboard-grid">
            {sessions.joined.length > 0 ? (
              sessions.joined.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  type="joined"
                  onLeave={handleLeave} // ✅ pass leave handler
                  currentUserId={currentUserId}
                />
              ))
            ) : (
              <p>No sessions joined.</p>
            )}
          </div>
        </section>

        {/* Available */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 className="section-title">
            Available Sessions ({sessions.available.length})
          </h2>
          <div className="dashboard-grid">
            {sessions.available.length > 0 ? (
              sessions.available.map((session) => {
                let type = "available";

                // Check if created by current user
                if (
                  String(session.createdBy?._id || session.createdBy) ===
                  String(currentUserId)
                ) {
                  type = "createdByMe";
                }
                // Check if already joined
                else if (sessions.joined.some((s) => s._id === session._id)) {
                  type = "alreadyJoined";
                }

                return (
                  <SessionCard
                    key={session._id}
                    session={session}
                    type={type}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                  />
                );
              })
            ) : (
              <p>No sessions available.</p>
            )}
          </div>
        </section>
      </main>

      {/* Edit Modal */}
      <EditSessionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        session={selectedSession}
        onSave={handleSaveEdit}
        onDelete={handleDeleteClick}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        sessionName={selectedDeleteSession?.name}
      />

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
