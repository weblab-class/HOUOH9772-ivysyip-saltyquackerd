const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  join_code: String,
  group_name: String,
  users: [],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
});

module.exports = mongoose.model("group", GroupSchema);
