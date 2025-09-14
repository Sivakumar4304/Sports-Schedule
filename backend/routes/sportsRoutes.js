// routes/sports.js
const express = require("express");
const router = express.Router();
const Sport = require("../models/Sports.js");
const { isLoggedIn } = require("../middleware");

// Get all sports
router.get("/", async (req, res) => {
  try {
    const sports = await Sport.find({});
    res.json({ sports });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sports" });
  }
});

// Add a sport
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const sport = new Sport({ name });
    await sport.save();
    res.json({ sport });
  } catch (err) {
    res.status(500).json({ error: "Failed to add sport" });
    console.log(err);
  }
});

// Edit a sport
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json({ sport });
  } catch (err) {
    res.status(500).json({ error: "Failed to update sport" });
  }
});

// Delete a sport
router.delete("/:id", async (req, res) => {
  try {
    await Sport.findByIdAndDelete(req.params.id);
    res.json({ message: "Sport deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete sport" });
  }
});

module.exports = router;
