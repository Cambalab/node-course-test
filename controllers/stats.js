module.exports = (mongoose) => {
  const Course = mongoose.model("Course");
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const request = require("request");
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

  function addStudents(studentList){
    studentList.forEach((student) => {
      addState(student.billingAddress.state,student._id);
    })
  }

  function getStats(req, res) {
    let courses = {};
    Evaluation.find()
      .then((failedEvals)=>{
        notes = failedEvals.reduce((fullNotes, eval)=>{
          return fullNotes.concat(eval.notes)
        }, []).filter((note)=>{
          return note.status === "failed"
        })

        return Promise.all(notes)
      })
      .then((notes)=>{
        students = notes.map((note)=>{
          return Student.findOne({_id:note.studentId})
        })

        return Promise.all(students)
      })
      .then((students) =>{
        addStudents(students);
        res.response200(stateArray);
      })
      .catch((err) =>{
        res.response500(err)
      });
  }
  return {getStats};
};
