module.exports = (mongoose,request, config) => {
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

  function _parseBillingAddress({street1,city,state,country}){
    return `${country}, ${state}, ${city}, ${street1}`;
  }

  function _getChargeableStudents(req, res, url) {
   
    return new Promise( (resolve,reject ) => {
      request.get(url+'/api/admin/billing/getChargeableStudents', (err,_,data) => {
        if (err)
          reject(err)
        try {
          const students = JSON.parse(data).data.studentsBillingInfo;
          resolve(students);
        }
        catch (err) {
          reject(err)
        }
      })
    })
  }

  function _generateInvoiceAFIP(student,url,json = null){
    return new Promise( (resolve,reject) => {
      if (!json) {
        json = {
          nomYAp: `${student.firstName}' '${student.lastName}`,
          dir: _parseBillingAddress(student.address),
          importe: parseFloat(student.price / 100)
        }
      }
      request.post(url+'/api/afip', {json:json}, (err,_, data) => {
        if (err){
          return reject(err)
        }

        if (data.status === 'success') {
          return resolve({BillingNumber:data.data.id, 
                          FirstAndLastName: json.nomYAp,
                          Address:json.dir,
                          price:student.price
                        })
        }
        console.log("AFIP fallo, Reintentando...",data);
        _generateInvoiceAFIP(student,url,json)
          .then( data => resolve(data))
          .catch( err => reject(err) )
      })
    })
  }

  function getInvoices(req, res) {
    const url = req.protocol + '://' + req.hostname + ':' + config.port;
    _getChargeableStudents(req, res, url)
    .then (students => {
      let invoicesPromise = [];
      students.forEach ( student => {
        invoicesPromise.push(_generateInvoiceAFIP(student,url));
      });
      return Promise.all(invoicesPromise);
    })
    .then ( invoices => {
      res.response200(invoices, `Found '${invoices.length}' Invoices.`);
    })
    .catch (err => {
      res.response500(err, "Error on get Chargeable Students");
    })
    

}

  return {
    getChargeableStudents,
    getInvoices
  };
};
