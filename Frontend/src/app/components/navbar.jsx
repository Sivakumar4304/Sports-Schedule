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
      console.error(err);
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
      <div className="navbar-container">
        <div className="navbar-brand">Sports Management</div>

        {/* Desktop Navigation */}
        <div className="navbar-links hidden-mobile">
          <span className="navbar-user">
            Welcome, {currentUser} ({currentUserRole})
          </span>
          {currentUserRole?.toLowerCase() === "admin" && (
            <button
              className="btn-accent"
              onClick={() => setIsAddSportModalOpen(true)}
            >
              Add Sport
            </button>
          )}
          <button className="btn-accent" onClick={() => setIsModalOpen(true)}>
            Create Session
          </button>
          <button className="btn-accent" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-items">
            <span className="navbar-user">
              Welcome, {currentUser} ({currentUserRole})
            </span>

            {currentUserRole?.toLowerCase() === "admin" && (
              <button
                className="btn-accent"
                onClick={() => setIsAddSportModalOpen(true)}
              >
                Add Sport
              </button>
            )}

            <button className="btn-accent" onClick={() => setIsModalOpen(true)}>
              Create Session
            </button>
            <button className="btn-accent" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Modal for Creating Session */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Create New Session</h2>

            <form className="modal-form" onSubmit={handleCreateSession}>
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
                  className="modal-input"
                />
              ))}

              <select
                name="sport"
                value={formData.sport}
                onChange={handleInputChange}
                required
                className="modal-input"
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

              <div className="modal-actions">
                <button type="submit" className="modal-btn save">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="modal-btn cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AddSportModal
        isOpen={isAddSportModalOpen}
        onClose={() => {
          setIsAddSportModalOpen(false);
          fetchSports();
        }}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 4rem;
        }

        .navbar-brand {
          font-family: "Playfair Display", serif;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .navbar-links,
        .mobile-menu-items {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-user {
          font-family: "Source Sans Pro", sans-serif;
          font-size: 0.9rem;
        }

        .btn-accent {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          background: #4f46e5;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-accent:hover {
          background: #4338ca;
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--primary-foreground, #000);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .mobile-menu {
          background: var(--primary, #fff);
          border-top: 1px solid var(--primary-foreground, #000);
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-box {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
          font-size: 0.95rem;
          outline: none;
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
        }

        .modal-btn.cancel {
          background: #e5e7eb;
          color: #111827;
        }

        .modal-btn.cancel:hover {
          background: #d1d5db;
        }
      `}</style>
    </nav>
  );
}
