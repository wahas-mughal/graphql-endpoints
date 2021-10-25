const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

module.exports = mongoose.model("Author", authorSchema);
