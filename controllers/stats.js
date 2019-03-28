module.exports = (mongoose) => {
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const stateArray = {};
  const addedStudents = [];
  function verifyExistentStudent(studentId, array) {
    let exist = false;
    array.forEach((student) => {
      if (studentId.toString() === student._id) {
        exist = true;
      }
    });

    return exist;
  }

  function incrementState(state) {
    if (stateArray[state]) {
      stateArray[state]++;
    } else {
      stateArray[state] = 1;
    }
  }

  function addStateByStudent(state, studentId) {
    if (!verifyExistentStudent(studentId, addedStudents)) {
      addedStudents.push(studentId);
      incrementState(state);
    }
  }

  function addStudentsToList(array) {
    array.forEach((student) => {
      addStateByStudent(student.billingAddress.state, student._id);
    });
  }

  function getFailuresByState(req, res) {
    Evaluation.find()
      .then((failedEvals) => {
        const notes = failedEvals.reduce((notesFiltered, toConcat) => {
          return notesFiltered.concat(toConcat.notes);
        }, []).filter((note) => {
          return note.status === "failed";
        });

        return Promise.all(notes);
      })
      .then((notes) => {
        const studentsFiltered = notes.map((note) => {
          return Student.findOne({_id: note.studentId});
        });

        return Promise.all(studentsFiltered);
      })
      .then((students) => {
        addStudentsToList(students);
        res.response200(stateArray);
      });
  }

  return {getFailuresByState};
};
