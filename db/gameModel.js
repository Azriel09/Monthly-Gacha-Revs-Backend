const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  server: {
    type: String,
    required: true,
    unique: false,
  },
  downloads: {
    type: Array,
    required: true,
    unique: false,
  },
  revenue: {
    type: Array,
    required: true,
    unique: false,
  },
  expandData: {
    type: Object,
    required: true,
    unique: false,
    revenueAndroid: { type: Array, required: true, unique: false },
    revenueApple: { type: Array, required: true, unique: false },
    downloadsAndroid: { type: Array, required: true, unique: false },
    downloadsApple: { type: Array, required: true, unique: false },
  },
});

// export GameSchema
module.exports = mongoose.model.Game || mongoose.model("Game", GameSchema);
