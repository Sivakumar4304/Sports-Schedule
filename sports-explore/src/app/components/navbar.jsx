"use client";
import Toast from "./Toast";
import AddSportModal from "./AddSportModal";
import { useState, useEffect } from "react";

export default function Navbar({
  currentUser,
  onSessionCreated,
  currentUserRole,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddSportModalOpen, setIsAddSportModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [sportsOptions, setSportsOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sport: "",
    dateTime: "",
    location: "",
    maxParticipants: 10,
  });

  // Fetch sports from backend
  const fetchSports = async () => {
    try {
      const res = await fetch("http://localhost:8080/sports", {
        credentials: "include",
      });
      const data = await res.json();
      setSportsOptions(data.sports || []);
    } catch (err) {
      setToast({ type: "error", message: "Failed to fetch sports" });
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        window.location.href = "/login";
        setToast({ type: "success", message: "Logging out..." });
      } else {
        setToast({ type: "error", message: "Failed to logout" });
      }
    } catch (err) {
      console.error("Error logging out:", err);
      setToast({ type: "error", message: "Error logging out" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        onSessionCreated?.(data.session, null);
        setIsModalOpen(false);
        setFormData({
          name: "",
          description: "",
          sport: "",
          dateTime: "",
          location: "",
          maxParticipants: 10,
        });
      } else {
        onSessionCreated?.(null, data.error || "Failed to create session");
      }
    } catch (err) {
      console.error(err);
      onSessionCreated?.(null, "Something went wrong");
    }
  };

  return (
    <nav className="navbar">
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4rem",
        }}
      >
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.5rem",
            fontWeight: "700",
          }}
        >
          Sports Management
        </div>

        {/* Desktop Navigation */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          className="hidden-mobile"
        >
          <span
            style={{
              fontFamily: "Source Sans Pro, sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Welcome, {currentUser} ({currentUserRole})
          </span>
          {currentUserRole?.toLowerCase() === "admin" && (
            <button
              className="btn-accent"
              onClick={() => setIsAddSportModalOpen(true)}
              style={{ fontSize: "0.9rem" }}
            >
              Add Sport
            </button>
          )}
          <button
            className="btn-accent"
            onClick={() => setIsModalOpen(true)}
            style={{ fontSize: "0.9rem" }}
          >
            Create Session
          </button>
          <button
            className="btn-accent"
            onClick={handleLogout}
            style={{ fontSize: "0.9rem" }}
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "var(--primary-foreground)",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            background: "var(--primary)",
            borderTop: "1px solid var(--primary-foreground)",
            padding: "1rem",
            display: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Source Sans Pro, sans-serif",
                fontSize: "0.9rem",
              }}
            >
              Welcome, {currentUser} ({currentUserRole})
            </span>

            {currentUserRole?.toLowerCase() === "admin" && (
              <button
                className="btn-accent"
                onClick={() => setIsAddSportModalOpen(true)}
                style={{ fontSize: "0.9rem" }}
              >
                Add Sport
              </button>
            )}

            <button
              className="btn-accent"
              onClick={() => setIsModalOpen(true)}
              style={{ fontSize: "0.9rem" }}
            >
              Create Session
            </button>
            <button
              className="btn-accent"
              onClick={handleLogout}
              style={{ fontSize: "0.9rem" }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Modal for Creating Session */}
      {isModalOpen && (
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
              Create New Session
            </h2>

            <form
              onSubmit={handleCreateSession}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {[
                "name",
                "description",
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
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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
                  }}
                />
              ))}

              {/* Sport Dropdown */}
              <select
                name="sport"
                value={formData.sport}
                onChange={handleInputChange}
                required
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "0.95rem",
                  background: "#fff",
                }}
              >
                <option value="" disabled>
                  Select Sport
                </option>
                {sportsOptions.map((sport) => (
                  <option key={sport._id} value={sport.name}>
                    {sport.name}
                  </option>
                ))}
              </select>

              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "#4f46e5",
                    color: "#fff",
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "#e5e7eb",
                    color: "#111827",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <AddSportModal
        isOpen={isAddSportModalOpen}
        onClose={() => {
          setIsAddSportModalOpen(false);
          fetchSports(); // refresh sports after adding
        }}
      />
    </nav>
  );
}
