const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  // username
  username: {
    type: String,
    required: [true, "Please provide a name"],
    unique: true,
  },

  //   password
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  token: {
    type: String,
    default: "",
  },
});

// export UserSchema
module.exports = mongoose.model.Admin || mongoose.model("Admin", AdminSchema);
