module.exports = (mongoose, app) => {
  const Course = mongoose.model("Course");
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const request = require('request');

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
        console.log(`Found '${studentsBillingInfo.length}' Students.`);
        res.response200({studentsBillingInfo}, `Found '${studentsBillingInfo.length}' Students.`);
      })
      .catch((err) => {
        res.response500(err, "Courses couldn't be found!");
      });
  }

  function getInvoices(req, res){
    getStudentsBillingInfo()
      .then((studentsBillingInfo) => {
        const afipInfo = studentsBillingInfo.map(getAfipStudentsInfo);
        return Promise.all(afipInfo);
      })
      .then((afipInvoices) => {
        console.log(`Found '${afipInvoices.length}' Students' invoices.`);
        res.response200({afipInvoices}, `Found '${afipInvoices.length}' Students' invoices.`);
      })
      .catch((err) => {
        res.response500(err, "Get invoices couldn't be found!");
      });
  }

  function getStudentsBillingInfo(){
    return new Promise((resolve, reject) => {
      try {
        request.get("http://localhost:3000/api/admin/billing/getChargeableStudents",
          (err, response, body) => {
            resolve(JSON.parse(body).data.studentsBillingInfo);
        });
      } catch (err){
        reject(err);
      }      
    })    
  }

  function getAfipStudentsInfo(studentBillingInfo){
    const afipStudentBillingInfo = {
      nomYAp: `${studentBillingInfo.firstName}, ${studentBillingInfo.lastName}`,
      dir: `${studentBillingInfo.address.street1}, ${studentBillingInfo.address.city}, ${studentBillingInfo.address.country}`,
      importe: studentBillingInfo.price/100
    };

    return new Promise((resolve, reject) => {
      request.post(
        "http://localhost:3000/api/afip", 
        {json: afipStudentBillingInfo},
        (err, response, body) => {
          try{
            const res = {
              BillingNumber: body.data.id,
              FirstAndLastName: afipStudentBillingInfo.nomYAp,
              Address: afipStudentBillingInfo.dir,
              price: (afipStudentBillingInfo.importe).toString()
            }
            resolve(res);
          } catch (err) {
            getAfipStudentsInfo(studentBillingInfo)
              .then(resolve);
          }
        }
      );
    })
  }

  return {
    getChargeableStudents,
    getInvoices
  };
};
