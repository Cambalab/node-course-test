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

  function getInvoices(req, res) {  
    const request = require("request"),
    url = "http://localhost:8000/api/admin/billing/getChargeableStudents";
  
    return new Promise((resolve, reject) => {
      request.get(url, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode === 200) {
          try {
            resolve(JSON.parse(body));
          } catch (ex) {
            console.error(ex);
            reject(new Error("Couldn't get data bills!"));
          }
        } else {
          console.error(response);
          reject(new Error("Couldn't get data bills!"));
        }
      });
    })
    .then((dataToInvoice) => {
      const bills = dataToInvoice.data.studentsBillingInfo.map((b) => {
          return postAfip(b);
      })
      return Promise.all(bills);
    })
    .then((bills) => {
      res.response200(bills);
    })
    .catch((err) => {
      res.response500(err, "Bills not generated!");
    });
  }

  function postAfip(dataToInvoice){
    const request = require("request"),
    url = "http://localhost:8000/api/afip";

    return new Promise((resolve, reject) => {   
    const formAfip = {
        nomYAp: dataToInvoice.firstName,
        dir: dataToInvoice.address.street1,
        importe: dataToInvoice.price/100
      };

    request.post(url, { json: formAfip}, (err, response, body) => {
      if (err) {
        reject(err);
      } else if (response.statusCode === 200) {
        try {
          console.log(body);
          const bill = { 
            BillingNumber: body.data.id,
            FirstAndLastName: dataToInvoice.firstName + ',' +  dataToInvoice.lastName,
            Address: dataToInvoice.address.street1,
            price: dataToInvoice.price/100
          }
          console.log(bill);
          resolve(bill);
        } catch (ex) {
          console.error(ex);
          reject(new Error("error de parseo "));
        }
      } else if (response.statusCode === 404){
        console.error('response:');
        console.error(response.statusCode);
        reject(new Error("error afip "));
        //postAfip(dataToInvoice);
      }
    });
  })
};
 
return {
    getChargeableStudents,
    getInvoices
  };
};
