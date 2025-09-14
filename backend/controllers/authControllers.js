// controllers/authController.js
const User = require("../models/user");

// Signup Controller
module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, role });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err)
        return res.status(500).json({ error: "Login after signup failed" });
      res.status(200).json({
        message: "Signup successful",
        user: {
          id: registeredUser._id,
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role,
        },
      });
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (!user)
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });

      // Successful login
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
};

// Logout Controller
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
};
