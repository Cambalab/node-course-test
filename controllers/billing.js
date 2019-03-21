const request = require("request");

module.exports = (mongoose) => {
  const Course = mongoose.model("Course");
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");


  // para cada curso dame la evaluacion
  // para cada evaluacion dame los aprobados
  // para cada aprobado dame el precio del curso y el student
  // Nombre, apellido, y direccion de facturacion
  // agrupar por student y calcular precio final
  // devolver precio, nombre, apellido y billing address

  /**
   * getChargeableStudents - get the students which passed the evaluation for a finished course
   *
   * @param  {type} req description
   * @param  {type} res description
   * @return {Array<StudentBillingInfo>} studentsBillingInfo
   */
  function getChargeableStudents(req, res) {
    let courses = {};
    Course.find({status: "finished"})
      .then((_courses) => {
        courses = _courses.reduce((coursesDict, course) => {
          // eslint-disable-next-line
          coursesDict[course._id] = course.price;
          return coursesDict;
        }, {});
        const promiseArray = _courses.map((course) => {
          return Evaluation.findOne({courseId: course._id});
        });
        return Promise.all(promiseArray);
      })
      .then((evaluations) => {
        return Promise.resolve(evaluations.map((evaluation) => {
          const evaluationStudents = evaluation.notes
            .filter((note) => {
              return note.status === "passed";
            })
            .map((student) => {
              return student.studentId;
            });
          return {
            courseId: evaluation.courseId,
            students: evaluationStudents
          };
        }));
      })
      .then((approvedStudentsToBill) => {
        const studentsWithPrice = {};
        approvedStudentsToBill.forEach((course) => {
          course.students.forEach((student) => {
            if (studentsWithPrice[student]) {
              studentsWithPrice[student] += courses[course.courseId];
            } else {
              studentsWithPrice[student] = courses[course.courseId];
            }
          });
        });
        return Promise.resolve(studentsWithPrice);
      })
      .then((studentsWithPrice) => {
        const studentsBillingInfo = Object.keys(studentsWithPrice).map((id) => {
          return new Promise((resolve) => {
            Student.findById(id).then((student) => {
              return resolve({
                firstName: student.firstName,
                lastName: student.lastName,
                address: student.billingAddress,
                price: studentsWithPrice[id]
              });
            });
          });
        });
        return Promise.all(studentsBillingInfo);
      })
      .then((studentsBillingInfo) => {
        res.response200({studentsBillingInfo}, `Found '${studentsBillingInfo.length}' Students.`);
      })
      .catch((err) => {
        res.response500(err, "Courses couldn't be found!");
      });
  }
  const dataResponse = [];

  function getAfipNumber(s) {
    const jsonStudent = {
      nomYAp: `${s.firstName} ${s.lastName}`,
      dir: `${s.street1}, ${s.city}, ${s.state}, ${s.zipCode}, ${s.country}`,
      importe: s.price // @TODO: pasarlo a con coma
    };

    return new Promise((resolve, reject) => {
      request({url: "http://localhost:8000/api/afip", method: "POST", json: jsonStudent}, (err2, response2, body2) => {
        if (err2) {
          console.log("ERROR");
          reject(err2);
        } else if (!body2.data) {
          console.log("AFIP ERROR");
          return getAfipNumber(s);
        } else {
          console.log("ID ", body2.data);
          dataResponse.push(body2.data);
        }
      });
    });
  }

  function getInvoices(req, res) {
    console.log("haciendo el request");

    request.get("http://localhost:8000/api/admin/billing/getChargeableStudents", (err, response, body) => {
      if (err) {
        console.log("Error");
      } else {
      // console.log(body);
      // console.log(body);

        const j = JSON.parse(body);

        Promise.all(j.data.studentsBillingInfo.map((student) => {
          // console.log(student);
          return getAfipNumber(student)
            .then((numero) => {
              // dataResponse.push({
              //   BillingNumber: numero,
              //   FirstAndLastName: `${student.firstName} ${student.lastName}`,
              //   Adress: `${student.street1}, ${student.city}, ${student.state}, ${student.zipCode}, ${student.country}`,
              //   price: student.price
              // });
            });
          // getAfipNumber(student);
        }));
      }
      console.log("data: ", dataResponse);
      res.response200(dataResponse);
    });
  }

  return {
    getInvoices,
    getChargeableStudents
  };
};
