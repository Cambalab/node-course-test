const GenericController = require("./genericController");

module.exports = (mongoose) => {
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");

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

  function failuresByStates(req, res) {
    Evaluation.find({},{notes: 1})
      .then(evaluations => {
        let failed = {};
        for(var i=0; i<evaluations.length; i++){
          let notes = evaluations[i].notes;
          for(var j=0; j<notes.length; j++){
            if(notes[j].status === "failed"){
              failed[notes[j].studentId] ? 
                failed[notes[j].studentId] = failed[notes[j].studentId] + 1 : 
                failed[notes[j].studentId] = 1;
            }
              
          }
        }
        return failed
      })
      .then(evalsFailed => {
        let promises = []
        Object.keys(evalsFailed).forEach(item => {
          promises.push(Student.find({"_id": { $eq: item}}, {"billingAddress.state": 1}))
        })
        return Promise.all(promises)    
      })
      .then(states => {
        let _states_ = {}
        for(var i=0; i<states.length; i++){
          _states_[states[i][0].billingAddress.state] ?
          _states_[states[i][0].billingAddress.state] = _states_[states[i][0].billingAddress.state] + 1 :
          _states_[states[i][0].billingAddress.state] = 1;
        }
        return _states_ 
      })
      .then(evalsFailed => {
        res.response200(evalsFailed, `Found ${Object.keys(evalsFailed).length} State.`);
      })
      .catch((err) => {
        res.response500(err, "evaluations couldn't be found!");
      });
  }

  return {
    ...controller,
    create: createEvaluation,
    failuresByStates
  };
};
