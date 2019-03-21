module.exports = (mongoose) => {
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const stateArray = {};
  const addedStudents = [];

  function addState(state, studentId) {
    if (!addedStudents.includes(studentId.toString())) {
      addedStudents.push(studentId.toString());
      if (stateArray[state]) {
        stateArray[state]++;
      } else {
        stateArray[state] = 1;
      }
    }
  }

  function addStudents(studentList) {
    studentList.forEach((student) => {
      addState(student.billingAddress.state, student._id);
    });
    return Promise.resolve(stateArray);
  }

  function getFailedNotes() {
    return Evaluation.find()
      .then((failedEvals) => {
        const notes = failedEvals.reduce((fullNotes, evaluation) => {
          return fullNotes.concat(evaluation.notes);
        }, []).filter((note) => {
          return note.status === "failed";
        });

        return Promise.all(notes);
      });
  }

  function getStudentsFromNotes(notes) {
    const students = notes.map((note) => {
      return Student.findOne({_id: note.studentId});
    });
    return Promise.all(students);
  }
  function failuresByStates(req, res) {
    getFailedNotes()
      .then(getStudentsFromNotes)
      .then(addStudents)
      .then(res.response200);
  }


  return {
    failuresByStates
  };
};
