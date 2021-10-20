const mongoose = require("mongoose");
const { Schema } = mongoose;

const testimonialSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
