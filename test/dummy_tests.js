const app = require("../app.js");
const {expect} = require("chai");
const request = require("supertest");
const mongoose = app.get("mongoose");
const Course = mongoose.model("Course");
const basePath = "/api/courses";
const invoicePath = "/api/admin/billing/getInvoices";
const validFilterParam = "?technologyId=";
const invalidFilterParam = "?techId=JS-000";
const Student = mongoose.model("Student");
const Evaluation = mongoose.model("Evaluation");

describe("Node Test", () => {
  let course1 = null;
  let course2 = null;

  before(() => {
    return Course.deleteMany({})
      .then(() => {
        console.log("Tasks collection cleaned!");
        return Promise.all([
          Course.create({
            "technologyId": "JS-000",
            "date": {
              "from": "2019-05-01T00:00:00.000Z",
              "to": "2019-05-15T00:00:00.000Z"
            },
            "description": "Node Js course",
            "status": "new",
            "classes": [
              {
                "name": "Programming basics with Node JS",
                "description": "A class to start programming with Node JS",
                "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                "tags": ""
              },
              {
                "name": "Programming with Node JS",
                "description": "A class to continue programming with Node JS",
                "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                "tags": ""
              },
              {
                "name": "Programming advanced with Node JS",
                "description": "A class to program with Node JS",
                "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                "tags": ""
              }
            ],
            "price": 123400,
            "students": []
          }),
          Course.create({
            "technologyId": "JS-001",
            "date": {
              "from": "2019-02-01T00:00:00.000Z",
              "to": "2019-02-28T00:00:00.000Z"
            },
            "description": "Vue Js course",
            "status": "finished",
            "classes": [
              {
                "name": "Programming basics with Vue JS",
                "description": "A class to start programming with Vue JS",
                "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                "tags": ""
              },
              {
                "name": "Programming with Vue JS",
                "description": "A class to continue programming with Vue JS",
                "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                "tags": ""
              },
              {
                "name": "Programming advanced with Vue JS",
                "description": "A class to program with Vue JS",
                "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                "tags": ""
              }
            ],
            "price": 432100,
            "students": [
              "5c8be6ec89a91670892d731a",
              "5c8be6ec89a91670892d731b",
              "5c8be6ec89a91670892d731c",
              "5c8be6ec89a91670892d731d",
              "5c8be6ec89a91670892d731e"
            ]
          })
        ]);
      })
      .then((data) => {
        course1 = data[0];
        course2 = data[1];
      });
  });

  context("Issue #1 - Testing Filter", () => {
    it("should filter courses by technologyId and return just one with the id JS-000", () => {
      return request(app)
        .get(`${basePath}${validFilterParam}${course1.technologyId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.courses).to.be.an("array");
          expect(res.body.data.courses.length).to.eql(1);
          expect(res.body.data.courses[0]._id.toString()).to.eql(course1._id.toString());
        });
    });

    it("should filter courses by technologyId and return just one with the id JS-001", () => {
      return request(app)
        .get(`${basePath}${validFilterParam}${course2.technologyId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.courses).to.be.an("array");
          expect(res.body.data.courses.length).to.eql(1);
          expect(res.body.data.courses[0]._id.toString()).to.eql(course2._id.toString());
        });
    });

    it("should return all courses due to invalid filter with an invalid param", () => {
      return request(app)
        .get(`${basePath}${invalidFilterParam}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.courses).to.be.an("array");
          expect(res.body.data.courses.length).to.eql(2);
        });
    });

    it("Should return all courses without passing any filtering params", () => {
      return request(app)
        .get(`${basePath}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.courses).to.be.an("array");
          expect(res.body.data.courses.length).to.eql(2);
        });
    });
  });

  context("Issue #2 - Testing getInvoice with AFIP", () => {
    // This test works with the database that not from test. Rest to mock de necessary data
    it.skip("Should return an array of student with their respective invoices", () => {
      return request(app)
        .get(`${invoicePath}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data).to.be.an("array");
        });
    });

    it.skip("Should returns the list of students with their respective invoice", () => {
      return request(app)
        .get(`${invoicePath}`)
        .expect(200)
        .then((res) => {
          expect(res.body.data.data);
          expect(res.body.data.length).to.be.eql(7);
          const invoice = res.body.data[0];
          expect(invoice.BillingNumber).to.be.a("number");
          expect(invoice.FirstAndLastName).to.be.eql("Everette Lehner");
          expect(invoice.address).to.be.eql("126 Schuppe Shore");
          expect(invoice.price).to.be.eql(932100);
        });
    });
  });
  context("Issue #3 - Testing cache MiddleWare", () => {
    it("Should return message 'Was cached!'", () => {
      return request(app)
        .get("/api/courses")
        .expect(200)
        .then(() => {
          return request(app)
            .get(`${basePath}`)
            .expect(200);
        })
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.message).to.be.eql("Was cached!");
        });
    });

    it("Should not return message 'Was cached!' When Posting new Course", () => {
      return request(app)
        .get("/api/courses")
        .expect(200)
        .then(() => {
          return request(app)
            .post("/api/courses")
            .send({
              "technologyId": "Ruby",
              "date": {
                "from": "2018-10-20T00:00:00Z",
                "to": "2018-10-21T00:00:00Z"
              },
              "description": "A Ruby starter course",
              "classes": [{"name": "Class 1", "description": "zaraza"}],
              "price": 3000,
              "students": ["pepe"]
            })
            .expect(200);
        })
        .then(() => {
          return request(app)
            .get("/api/courses")
            .expect(200);
        })
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.message).not.to.be.eql("Was cached!");
        });
    });
  });

  context("Issue #4 - Testing States who Students Fail the", () => {
    before(async () => {
      await Student.deleteMany({});
      await Evaluation.deleteMany({});
      const students = [
        {
          "_id": "5c92b9f262e5287d7db5602f",
          "firstName": "Pupa",
          "lastName": "Polainas",
          "billingAddress": {
            "_id": "5c92b9f262e5287d7db56030",
            "street1": "Av. De Mayo 776",
            "city": "Buenos Aires",
            "state": "Buenos Aires",
            "zipCode": "1084",
            "country": "Argentina"
          },
          "creditCards": [
          ]
        },
        {
          "_id": "5c92b9f262e5287d7db56fff",
          "firstName": "Pupa",
          "lastName": "Polainas",
          "billingAddress": {
            "_id": "5c92b9f262e5287d7db56030",
            "street1": "Av. De Mayo 776",
            "city": "Buenos Aires",
            "state": "Catamarca",
            "zipCode": "1084",
            "country": "Argentina"
          },
          "creditCards": [
          ]
        },
        {
          "_id": "5c92b9f262e5287d7db5ffff",
          "firstName": "Pupa",
          "lastName": "Polainas",
          "billingAddress": {
            "_id": "5c92b9f262e5287d7db56030",
            "street1": "Av. De Mayo 776",
            "city": "Buenos Aires",
            "state": "Santiago",
            "zipCode": "1084",
            "country": "Argentina"
          },
          "creditCards": [
          ]
        },
        {
          "_id": "5c92b9f262e5287d7db56aaa",
          "firstName": "Pupa",
          "lastName": "Polainas",
          "billingAddress": {
            "_id": "5c92b9f262e5287d7db56030",
            "street1": "Av. De Mayo 776",
            "city": "Buenos Aires",
            "state": "CABA",
            "zipCode": "1084",
            "country": "Argentina"
          },
          "creditCards": [
          ]
        },
        {
          "_id": "5c92b9f262e5287d7db56aab",
          "firstName": "Pupa",
          "lastName": "Polainas",
          "billingAddress": {
            "_id": "5c92b9f262e5287d7db56030",
            "street1": "Av. De Mayo 776",
            "city": "Buenos Aires",
            "state": "CABA",
            "zipCode": "1084",
            "country": "Argentina"
          },
          "creditCards": [
          ]
        }
      ];
      const evaluations = [
        {
          "_id": "5c92d654e34b581661a5779a",
          "courseId": "5c8c09ff444bfa0dfa450066",
          "date": {
            "from": "2019-03-21T00:00:00.000Z",
            "to": "2019-03-22T00:00:00.000Z"
          },
          "abstract": "The evaluation for the Ruby course. Write JS stuff to pass",
          "notes": [
            {
              "_id": "5c92d654e34b581661a5779b",
              "studentId": "5c92b9f262e5287d7db5602f",
              "qualification": 2,
              "status": "failed"
            }
          ]
        },
        {
          "_id": "5c92d654e34b581661a577dd",
          "courseId": "5c8c09ff444bfa0dfa450066",
          "date": {
            "from": "2019-03-21T00:00:00.000Z",
            "to": "2019-03-22T00:00:00.000Z"
          },
          "abstract": "The evaluation for the Ruby course. Write JS stuff to pass",
          "notes": [
            {
              "_id": "5c92d654e34b581661a5779b",
              "studentId": "5c92b9f262e5287d7db5602f",
              "qualification": 2,
              "status": "failed"
            }
          ]
        },
        {
          "_id": "5c92d654e34b581661a577de",
          "courseId": "5c8c09ff444bfa0dfa450066",
          "date": {
            "from": "2019-03-21T00:00:00.000Z",
            "to": "2019-03-22T00:00:00.000Z"
          },
          "abstract": "The evaluation for the Ruby course. Write JS stuff to pass",
          "notes": [
            {
              "_id": "5c92d654e34b581661a5779b",
              "studentId": "5c92b9f262e5287d7db56fff",
              "qualification": 1,
              "status": "failed"
            }
          ]
        },
        {
          "_id": "5c92d654e34b581661a577ee",
          "courseId": "5c8c09ff444bfa0dfa450066",
          "date": {
            "from": "2019-03-21T00:00:00.000Z",
            "to": "2019-03-22T00:00:00.000Z"
          },
          "abstract": "The evaluation for the Ruby course. Write JS stuff to pass",

          "notes": [
            {
              "_id": "5c92d654e34b581661a5779b",
              "studentId": "5c92b9f262e5287d7db56aaa",
              "qualification": 1,
              "status": "failed"
            }
          ]
        },
        {
          "_id": "5c92d654e34b581661a577e2",
          "courseId": "5c8c09ff444bfa0dfa450066",
          "date": {
            "from": "2019-03-21T00:00:00.000Z",
            "to": "2019-03-22T00:00:00.000Z"
          },
          "abstract": "The evaluation for the Ruby course. Write JS stuff to pass",
          "notes": [
            {
              "_id": "5c92d654e34b581661a5779b",
              "studentId": "5c92b9f262e5287d7db56aab",
              "qualification": 1,
              "status": "failed"
            }
          ]
        },
        {
          "_id": "5c92d654e34b581661a5ffe2",
          "courseId": "5c8c09ff444bfa0dfa450066",
          "date": {
            "from": "2019-03-21T00:00:00.000Z",
            "to": "2019-03-22T00:00:00.000Z"
          },
          "abstract": "The evaluation for the Ruby course. Write JS stuff to pass",
          "notes": [
            {
              "_id": "5c92d654e34b581661a5779b",
              "studentId": "5c92b9f262e5287d7db5ffff",
              "qualification": 9,
              "status": "passed"
            }
          ]
        }
      ];
      await Student.insertMany(students);
      await Evaluation.insertMany(evaluations);
    });

    it("Should returns the Number of students by city that have failed one evaluationn", () => {
      return request(app)
        .get("/api/stats/failuresByStates")
        .expect(200)
        .then((res) => {
          expect(res.body.data.data);
          expect(res.body.data.Catamarca).to.be.eql(1);
        });
    });

    it("Should returns the Number of students by city that have failed two evaluation", () => {
      return request(app)
        .get("/api/stats/failuresByStates")
        .expect(200)
        .then((res) => {
          expect(res.body.data.data);
          expect(res.body.data.CABA).to.be.eql(2);
        });
    });

    it("Should returns the Number of students by city that have no failed any evaluations", () => {
      return request(app)
        .get("/api/stats/failuresByStates")
        .expect(200)
        .then((res) => {
          expect(res.body.data.data);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.data.Santiago).to.be.undefined;
        });
    });
  });
});
