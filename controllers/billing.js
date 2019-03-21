module.exports = (mongoose, request, config) => {
  const Course = mongoose.model("Course");
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const afipUrl = 'http://localhost:'+config.port+'/api/afip';

  // para cada curso dame la evaluacion
  // para cada evaluacion dame los aprobados
  // para cada aprobado dame el precio del curso y el student
  // Nombre, apellido, y direccion de facturacion
  // agrupar por student y calcular precio final
  // devolver precio, nombre, apellido y billing address

  function getChargeables(){
    return new Promise((resolve, reject) => {
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
          resolve(Promise.all(studentsBillingInfo));
        })
        .catch((err) => {
          reject(err);
        });
    })
  }

  /**
   * getChargeableStudents - get the students which passed the evaluation for a finished course
   *
   * @param  {type} req description
   * @param  {type} res description
   * @return {Array<StudentBillingInfo>} studentsBillingInfo
   */
  function getChargeableStudents(req, res) {
    getChargeables()
      .then((studentsBillingInfo) => {
        res.response200({studentsBillingInfo}, `Found '${studentsBillingInfo.length}' Students.`);
      })
      .catch((err) => {
        res.response500(err, "Courses couldn't be found!");
      });
  }

  function getInvoices(req, res) {
    getChargeables()
      .then(students => {
        return students.map(item => {
          return {       
            nomYAp: `${item.firstName} ${item.lastName}`,
            dir: `${item.address.street1}, ${item.address.city}, ${item.address.state}, ${item.address.country}`,
            importe: item.price / 100       
          }
        })
      })
      .then(async (toInvoice) => {
        let data = [];
        let initLength = toInvoice.length;
        while (data.length < initLength) {
          let elem = toInvoice.shift();
          await callAFIP(elem)
            .then(info => {
              data.push({
                BillingNumber: info.data.id+"",
                FirstAndLastName: elem.nomYAp,
                Address: elem.dir ,
                price: elem.importe+""
              });
            })
            .catch(err => {
              toInvoice.push(elem);
            })
        }   
        res.response200(data, `Found '${data.length}' Students to invoice.`);
      })
      .catch(err => {
        res.response500(err, "Courses couldn't be found!");
      })
  }

  function callAFIP(obj){
    return new Promise((resolve, reject) => {
      request.post(afipUrl, {json: obj}, (err, res, info) => {  
        if(err) {
          reject(err);
        } else if(info.status == "error")
            reject(info.message);
          else
            resolve(info);
      })
    })
  }

  return {
    getChargeableStudents,
    getInvoices
  };
};
