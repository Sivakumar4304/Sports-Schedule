const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { isLoggedIn } = require("../middleware");

// Routes
router.post("/", isLoggedIn, sessionController.createSession); // Create session
router.get("/", isLoggedIn, sessionController.getSessions); // All sessions
router.get("/created", sessionController.getMyCreatedSessions); // My created sessions
router.get("/my-sessions", isLoggedIn, sessionController.getUserSessions);
router.get("/available", isLoggedIn, sessionController.getAvailableSessions);

// Get available sessions
router.get("/available", sessionController.getAvailableSessions);

router.put("/:id", isLoggedIn, sessionController.updateSession);

router.delete("/:id", isLoggedIn, sessionController.deleteSession);

router.post("/:sessionId/join", isLoggedIn, sessionController.joinSession);
router.post("/:sessionId/leave", isLoggedIn, sessionController.leaveSession);

module.exports = router;
