const Session = require("../models/Sportsession");
const User = require("../models/user");

// Create a new session
module.exports.createSession = async (req, res) => {
  try {
    const { name, description, sport, dateTime, location, maxParticipants } =
      req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newSession = new Session({
      name,
      description,
      sport,
      dateTime,
      location,
      maxParticipants,
      creator: req.user._id, // ✅ aligned with schema
      participants: [req.user._id], // auto join creator
    });

    await newSession.save();
    res
      .status(201)
      .json({ message: "Session created successfully", session: newSession });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all sessions
module.exports.getSessions = async (req, res) => {
  try {
    const userId = req.user._id; // get the logged-in user's ID
    const userName = req.user.name; // get the logged-in user's name
    console.log(userId);
    console.log(userName);
    const sessions = await Session.find().populate("createdBy", "name email");
    res.json(sessions, userName);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// Get sessions created by the logged-in user
module.exports.getMyCreatedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user._id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your created sessions" });
  }
};

// Get sessions joined by the user
module.exports.getMyJoinedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ participants: req.user._id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch joined sessions" });
  }
};

module.exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const userName = user.name;
    const userRole = user.role;
    const created = await Session.find({ creator: userId });
    const joined = await Session.find({ participants: userId });

    res.json({ userId, created, joined, userName, userRole }); // ✅ return userId also
  } catch (err) {
    res.status(500).json({ message: "Error fetching sessions" });
  }
};

// module.exports.getUserSessions = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     const userName = user.name;
//     const userRole = user.role;

//     // Fetch all sessions
//     const sessions = await Session.find()
//       .populate("creator", "name")
//       .populate("participants", "name");

//     // Map sessions to include 'type' based on user
//     const mappedSessions = sessions.map((session) => {
//       let type = "available";
//       if (session.creator._id.equals(userId)) {
//         type = "createdByMe";
//       } else if (session.participants.some((p) => p._id.equals(userId))) {
//         type = "alreadyJoined";
//       }
//       return { ...session.toObject(), type };
//     });

//     res.json({ userId, userName, userRole, sessions: mappedSessions });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching sessions" });
//   }
// };

// Get available sessions (include all, even user's own)
exports.getAvailableSessions = async (req, res) => {
  try {
    const available = await Session.find(); // ✅ don't filter out user
    res.json({ available });
  } catch (err) {
    console.error("Error fetching available sessions", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only allow the creator to edit
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (String(session.creator) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this session" });
    }

    const updated = await Session.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ message: "Failed to update session" });
  }
};

module.exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Only creator can delete
    if (String(session.creator) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this session" });
    }

    await Session.findByIdAndDelete(id);
    res.json({ message: "Session deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

// Join a session
module.exports.joinSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if already joined
    if (session.participants.includes(userId)) {
      return res.status(400).json({ message: "Already joined this session" });
    }

    // check max limit
    if (session.participants.length >= session.maxParticipants) {
      return res.status(400).json({ message: "Session is full" });
    }

    session.participants.push(userId);
    await session.save();

    res.status(200).json({ message: "Joined session successfully", session });
  } catch (error) {
    res.status(500).json({ message: "Failed to join session" });
  }
};

// Leave a session
module.exports.leaveSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not part of this session" });
    }

    session.participants = session.participants.filter(
      (p) => p.toString() !== userId.toString()
    );

    await session.save();

    res.status(200).json({ message: "Left session successfully", session });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave session" });
  }
};
