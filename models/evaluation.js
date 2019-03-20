const mongoose = require("mongoose");

const EvaluationStudent = new mongoose.Schema({
  studentId: {type: String, required: true},
  qualification: {type: Number, required: true},
  status: {
    type: String,
    enum: ["passed", "failed"],
    required: true
  }
});

const EvaluationSchema = new mongoose.Schema({
  courseId: {type: String, required: true},
  date: {
    from: {type: Date, required: true},
    to: {type: Date, required: true}
  },
  abstract: {type: String, required: true},
  // the ids of the students
  notes: [EvaluationStudent]
});

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);

module.exports = {
  EvaluationSchema,
  Evaluation
};
