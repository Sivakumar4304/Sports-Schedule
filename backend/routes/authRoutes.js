// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const Authenticate = require("../controllers/authControllers");

const router = express.Router();

// Signup
router.post("/signup", Authenticate.signup);

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (!user)
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});

// Logout
router.get("/logout", Authenticate.logout);

module.exports = router;
