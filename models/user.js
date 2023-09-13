const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);

module.exports = mongoose.model("User", UserSchema);
