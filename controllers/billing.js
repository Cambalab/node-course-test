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
                price: studentsWithPrice[id] / 100
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
  function getStudentsBillingInfo() {
    const options = {
      url: "http://localhost:8000/api/admin/billing/getChargeableStudents",
      headers: {
        "user-agent": "node-exam"
      }
    };

    return new Promise((resolve, reject) => {
      request.get(options, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode === 200) {
          try {
            const studentsBillingInfo = JSON.parse(body).data.studentsBillingInfo;
            resolve(studentsBillingInfo);
          } catch (ex) {
            // console.error(ex);
            // Log the exception but returns an error without any sensitive data!
            reject(new Error("Couldn't get node repos!"));
          }
        } else {
          console.error(response);
          // Log the conflictive response but returns an error without any sensitive data!
          reject(new Error("Couldn't get billing student!"));
        }
      });
    });
  }
  function formatObject(infoAfip, studentInfo) {
    return ({
      "BillingNumber": infoAfip.id,
      "FirstAndLastName": studentInfo.nomYAp,
      "Address": studentInfo.dir,
      "price": studentInfo.importe
    });
  }
  function getAfipInfo(studentInfo) {
    const options = {
      url: "http://localhost:8000/api/afip",
      headers: {
        "user-agent": "node-exam"
      }
    };
    return new Promise((resolve, reject) => {
      request.post(options.url, {json: studentInfo}, (_, response, body) => {
        if (response.statusCode === 404) {
          resolve(getAfipInfo(studentInfo));
        } else if (response.statusCode === 200) {
          try {
            resolve(formatObject(body.data, studentInfo));
          } catch (ex) {
            console.error(ex);
            // Log the exception but returns an error without any sensitive data!
            reject(new Error("Couldn't get node repos!"));
          }
        } else {
          console.error(response);
          // Log the conflictive response but returns an error without any sensitive data!
          reject(new Error("Couldn't get billing student!"));
        }
      });
    });
  }
  function formatStudentForAfip(student) {
    const {firstName, lastName, address, price} = student;
    return {"nomYAp": `${firstName} ${lastName}`, "dir": address.street1, "importe": price};
  }
  function getAfipStudensInfo(students) {
    const promiseArray = students.map((student) => {
      const studentInfo = formatStudentForAfip(student);
      return getAfipInfo(studentInfo);
    });
    return Promise.all(promiseArray);
  }
  async function getInvoices(req, res) {
    try {
      const students = await getStudentsBillingInfo(req, res);
      const afipFinalInfo = await getAfipStudensInfo(students);
      res.response200(afipFinalInfo, "Success");
    } catch (error) {
      res.response500(error, "Error");
    }
  }

  return {
    getChargeableStudents,
    getInvoices
  };
};
