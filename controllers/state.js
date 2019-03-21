
module.exports = (mongoose) => {
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  let studentsFail = [];


  function getFailuresByStates(req, res) {
    Evaluation.find({})
      .then((evaluations) => {
        return Promise.resolve(evaluations.map((evaluation) => {
          const evaluationStudents = evaluation.notes
            .filter((note) => {
              return note.status === "failed";
            })
            .map((student) => {
              return student.studentId;
            });
          evaluationStudents.forEach((e) => {
            studentsFail.push(e);
            console.log(e.toString());
          });
          return evaluationStudents;
        }));
      }).then(() => {
        // Deleted the repeted students
        studentsFail = studentsFail.filter((item, index, array) => {
          return array.indexOf(item) === index;
        });
        const countrys = [];
        // Function for add countrys
        function agregarPais(pais) {
          let paisEncontrado = false;
          countrys.forEach((registro) => {
            if (registro.pais === pais) {
              registro.contador += 1;
              paisEncontrado = true;
            }
          });
          if (!paisEncontrado) {
            countrys.push({pais, contador: 1});
          }
        }
        // Function for convert an array of countries to an object
        function convertToObj(arregloPaises) {
          const obj = {};
          Promise.all(arregloPaises.map((registro) => {
            return new Promise((resolve) => {
              obj[registro.pais] = registro.contador;
              resolve();
            });
          }));
          res.response200(obj);
        }

        Promise.all(studentsFail.map((studentid) => {
          return Student.findOne({_id: studentid})
            .then((student) => {
              agregarPais(student.billingAddress.country);
            });
        }))
          .then(() => {
            convertToObj(countrys);
            console.log("countrys", countrys);
          });
      });
  }

  return {
    getFailuresByStates
  };
};
