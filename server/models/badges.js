const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
  badge_description: String,
  picture: String,
  category: String,
});

module.exports = mongoose.model("badge", BadgeSchema);
