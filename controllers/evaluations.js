const GenericController = require("./genericController");

module.exports = (mongoose) => {
  const listOptions = {
    filterBy: [],
    sortBy: []
  };
  const controller = GenericController(mongoose, "Evaluation", listOptions);

  function getEvaluationDTO(evaluation) {
    const evaluationDTO = evaluation;
    evaluationDTO.date.from = new Date(evaluation.date.from);
    evaluationDTO.date.to = new Date(evaluation.date.to);
    return evaluationDTO;
  }

  function createEvaluation(req, res) {
    return controller.create(req, res, {normalize: getEvaluationDTO});
  }

  controller.create = createEvaluation;

  return controller;
};
