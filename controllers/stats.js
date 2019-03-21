module.exports = (mongoose) => {
  var Course = mongoose.model("Course"),
    Evaluation = mongoose.model("Evaluation"),
    Student = mongoose.model("Student")
  ;
  
  // For every course finished give me its evaluation
  // for every evaluation give me their notes
  // filter every note whos student didnt pass
  // for every note give me it's student
  // make a Set with every student who didnt pass
  // for every student, get his state
  // for every state, count how many student didnt pass
  function failuresByStates(req, res) {
    let courses = {};
    Course.find({status: "finished"})
    .then((courses) => {
      const evaluationPromises = courses.map((course) => {
        return Evaluation.findOne({courseId: course._id});
      });
      return Promise.all(evaluationPromises);
    })
    .then((evaluations) => {
      const notes = evaluations.map(e => e.notes).reduce((r,n) => r.concat(n), []);
      return Promise.resolve(notes);
    })
    .then((notes) => {
      const filteredNotes = notes.filter(note => note.status === "failed");
      return Promise.resolve(filteredNotes);
    })
    .then((notes) => {
      const studentsPromises = notes.map((note) => {
        return Student.findOne({_id: note.studentId});
      });
      return Promise.all(studentsPromises);
    })
    .then((students) => {
      const studentsSet = new Set(students);
      return Promise.resolve(Array.from(studentsSet));
    })
    .then((students) => {
      const studentsState = students.map(student => student.billingAddress.state)
      return Promise.resolve(studentsState);
    })
    .then((studentByStates) => {
      const res = {};
      const failuresBystate = studentByStates.reduce((r, studentState) => {
        if(r[studentState] == undefined){
          r[studentState] = 1;
        } else{
          r[studentState] += 1;
        }
        return r;
      }, res);
      return Promise.resolve(failuresBystate);
    })
    .then((failuresBystate) => {
      res.response200({failuresBystate}, `Found '${Object.keys(failuresBystate).length}' states whos students failed.`);
    })
    .catch((err) => {
      res.response500(err, "Failures couldn't be found!");
    });
  }

  return {
    failuresByStates
  };
};
