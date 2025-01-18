const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  join_code: String,
  group_name: String,
  users: [],
});

module.exports = mongoose.model("group", GroupSchema);
