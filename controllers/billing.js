module.exports = (mongoose) => {
  const Course = mongoose.model("Course");
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const request = require("request");
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
  function requestChargeableStudents() {
    return new Promise((resolve, reject) => {
      request.get("http://localhost:8000/api/admin/billing/getChargeableStudents", (_, __, body) => {
        let students = [];
        try {
          students = JSON.parse(body).data.studentsBillingInfo;
        } catch (ex) {
          reject(new Error("error"));
        }
        const studentsAfip = [];
        students.forEach((student) => {
          studentsAfip.push({nomYAp: `${student.firstName} ${student.lastName}`, dir: student.address.street1, importe: student.price});
        });
        resolve(studentsAfip);
      });
    });
  }

  function mapAFIPResponse(invoiceId, student) {
    return {
      BillingNumber: invoiceId,
      FirstAndLastName: student.nomYAp,
      address: student.dir,
      price: student.importe
    };
  }

  function createInvoice(data) {
    return new Promise((resolve) => {
      request.post("http://localhost:8000/api/afip", {json: data}, (_, resp, body) => {
        if (resp.statusCode === 200) {
          resolve(mapAFIPResponse(body.data.id, data));
        } else {
          resolve(createInvoice(data));
        }
      });
    });
  }

  function requestInvoices(students) {
    return Promise.all(students.map((student) => {
      return createInvoice(student);
    }));
  }

  async function getInvoices(req, res) {
    requestChargeableStudents().then((students) => {
      return requestInvoices(students);
    })
      .then((invoices) => {
        res.response200(invoices);
      })
      .catch(() => {
        res.response500("There was an error :(");
      });
  }


  return {
    getChargeableStudents,
    getInvoices
  };
};
