module.exports = (mongoose) => {
  const Course = mongoose.model("Course");
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const request = require("request");

  function convertAfipObject({id}, student) {
    return {
      BillingNumber: id,
      FirstAndLastName: student.nomYAp,
      Address: student.dir,
      price: student.importe
    };
  }

  function afipInvoice(student) {
    return new Promise((resolve, reject) => {
      request.post("http://localhost:8000/api/afip", {json: student}, (req, res) => {
        if (res.statusCode === 404) {
          resolve(afipInvoice(student));
        } else if (res.statusCode === 200) {
          resolve(convertAfipObject(res.body.data, student));
        } else {
          reject();
        }
      });
    });
  }

  async function requestAfipInvoices(students) {
    const response = students.map((student) => {
      return afipInvoice(student);
    });
    return Promise.all(response);
  }


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

  function requestChargableStudents() {
    return new Promise((resolve, reject) => {
      request.get("http://localhost:8000/api/admin/billing/getChargeableStudents", (_, __, body) => {
        let bodyData = null;
        try {
          bodyData = JSON.parse(body);
        } catch (ex) {
          reject(ex);
        }
        const afipArray = [];
        bodyData.data.studentsBillingInfo.forEach((student) => {
          const {firstName, lastName, address, price: importe} = student;
          afipArray.push({
            nomYAp: `${firstName} ${lastName}`,
            dir: address.street1,
            importe: importe / 100
          });
        });
        resolve(afipArray);
      });
    });
  }

  async function getInvoices(req, res) {
    try {
      const afipArray = await requestChargableStudents();
      const studentsWithAfip = await requestAfipInvoices(afipArray);
      res.response200(studentsWithAfip, "Successfully collected student billing data with invoices");
    } catch (err) {
      res.response500(err, "couldn't get invoices");
    }
  }


  return {
    getChargeableStudents,
    getInvoices
  };
};
