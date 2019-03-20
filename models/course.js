const mongoose = require("mongoose");

const CourseClass = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: false
  }
});

const CourseSchema = new mongoose.Schema({
  technologyId: {
    type: String,
    required: true
  },
  date: {
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["new", "registration open", "ongoing", "finished"],
    default: "new"
  },
  classes: [CourseClass],
  // the ids of the students
  students: [String],
  price: {type: Number, required: true}
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  CourseClass,
  CourseSchema,
  Course
};
