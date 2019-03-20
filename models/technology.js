const mongoose = require("mongoose");

const TechnologySchema = new mongoose.Schema({
  // The human readable name
  name: {type: String, required: true},
  // slug-case name. Used as identifier by other models
  technologyId: {type: String, required: true}
});

const Technology = mongoose.model("Technology", TechnologySchema);

module.exports = {
  TechnologySchema,
  Technology
};
