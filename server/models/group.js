const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  join_code: String,
  group_name: String,
  users: [],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  completedDaily: { type: Boolean, default: false },
  badges: { type: [String], default: [] },
});

module.exports = mongoose.model("group", GroupSchema);
