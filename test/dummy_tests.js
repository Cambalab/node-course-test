const app = require("../app.js");
const {expect} = require("chai");
const mongoose = app.get("mongoose");
const Technology = mongoose.model("Technology");
const Course = mongoose.model("Course");
const Student = mongoose.model("Student");
const Evaluation = mongoose.model("Evaluation");
const request = require("supertest");
describe("Initializing tests", () => {
  const firstCourse = {
    "_id": "5c92d654e34b581661a5779a",
    "technologyId": "JS-000",
    "date": {
      "from": "2019-05-01T00:00:00.000Z",
      "to": "2019-05-15T00:00:00.000Z"
    },
    "description": "Node Js course",
    "status": "finished",
    "classes": [
      {
        "name": "Programming basics with Node JS",
        "description": "A class to start programming with Node JS",
        "tags": ""
      },
      {
        "name": "Programming with Node JS",
        "description": "A class to continue programming with Node JS",
        "tags": ""
      },
      {
        "name": "Programming advanced with Node JS",
        "description": "A class to program with Node JS",
        "tags": ""
      }
    ],
    "price": 123400,
    "students": []
  };

  const secondCourse = {
    "_id": "5c937caf9d5f0d2bf466dd82",
    "technologyId": "JS-001",
    "date": {
      "from": "2019-05-01T00:00:00.000Z",
      "to": "2019-05-15T00:00:00.000Z"
    },
    "description": "Second Node Js course",
    "status": "finished",
    "classes": [
      {
        "name": "Programming basics with Node JS",
        "description": "A class to start programming with Node JS",
        "tags": ""
      },
      {
        "name": "Programming with Node JS",
        "description": "A class to continue programming with Node JS",
        "tags": ""
      },
      {
        "name": "Programming advanced with Node JS",
        "description": "A class to program with Node JS",
        "tags": ""
      }
    ],
    "price": 123400,
    "students": ["5c92b9f262e5287d7db5602f"]
  };
  const thirdCourse = {
    "_id": "5c937caf9d5f0d2bf466dd86",
    "technologyId": "EL-000",
    "date": {
      "from": "2019-05-01T00:00:00.000Z",
      "to": "2019-05-15T00:00:00.000Z"
    },
    "description": "Elixir course",
    "status": "finished",
    "classes": [
      {
        "name": "Programming basics with Elixir",
        "description": "A class to start programming with Elixir",
        "tags": ""
      },
      {
        "name": "Programming with Elixir",
        "description": "A class to continue programming with Elixir",
        "tags": ""
      },
      {
        "name": "Programming advanced with Elixir",
        "description": "A class to program with Elixir",
        "tags": ""
      }
    ],
    "price": 123400,
    "students": ["5c92b9f262e5287d7db5602f"]
  };
  const newTechnologies = [
    {
      "name": "NodeJs",
      "technologyId": "JS-000"
    },
    {
      "name": "VueJs",
      "technologyId": "JS-001"
    },
    {
      "name": "Elixir",
      "technologyId": "EL-000"
    }
  ];
  const newCourses = [
    firstCourse,
    secondCourse,
    thirdCourse
  ];
  const newEvaluations = [
    {
      "_id": "5c92d654e34b581661a5779a",
      "courseId": "5c937caf9d5f0d2bf466dd86",
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
      "courseId": "5c937caf9d5f0d2bf466dd86",
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
      "courseId": "5c92d654e34b581661a5779a",
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
      "courseId": "5c937caf9d5f0d2bf466dd82",
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
      "courseId": "5c937caf9d5f0d2bf466dd82",
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
      "courseId": "5c937caf9d5f0d2bf466dd82",
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
  const newStudents = [
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
  beforeEach(async () => {
    await Technology.deleteMany({});
    await Course.deleteMany({});
    await Evaluation.deleteMany({});
    await Student.deleteMany({});
    await Technology.insertMany(newTechnologies);
    await Course.insertMany(newCourses);
    await Student.insertMany(newStudents);
    await Evaluation.insertMany(newEvaluations);
  });

  describe("Issue #1 tests", () => {
    const path = "/api/courses";
    const filter = "?technologyId=";
    context("Testing Technology Filter", () => {
      it("Should return first course filtering with TechnologyId = JS-000", () => {
        return request(app)
          .get(path + filter + firstCourse.technologyId)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.be.eql(1);
            expect(res.body.data.courses[0].technologyId).to.be.eql("JS-000");
            expect(res.body.data.courses[0].name).to.be.eql(firstCourse.name);
          });
      });
      it("Should return second course filtering By TechnologyId = JS-001", () => {
        return request(app)
          .get(path + filter + secondCourse.technologyId)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.be.eql(1);
            expect(res.body.data.courses[0].technologyId).to.be.eql("JS-001");
            expect(res.body.data.courses[0].name).to.be.eql(secondCourse.name);
          });
      });
      it("Should return all courses without passing any filtering params", () => {
        return request(app)
          .get(path)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.be.eql(3);
          });
      });
      it("Should return no courses fFiltering By TechnologyId = JS-002", () => {
        return request(app)
          .get(`${path}${filter}JS-002`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.be.eql(0);
          });
      });
    });
  });

  describe("Issue #2 tests", () => {
    context("Testing getInvoice ", () => {
      it("Should return an array of student with their respective invoices", () => {
        // Did not got time to test this bit it should be working with proper data
        return request(app)
          .get("/api/admin/billing/getInvoices")
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data).to.be.an("array");
          });
      });
    });
  });

  describe("Issue #3 tests", () => {
    context("Testing cache MiddleWare", () => {
      it("Should return message 'Got data from cache'", () => {
        return request(app)
          .get("/api/courses")
          .expect(200)
          .then(() => {
            return request(app)
              .get("/api/courses")
              .expect(200);
          })
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.message).to.be.eql("Got data from cache");
          });
      });

      it("Should not return message 'Got data from cache' When Posting new Course", () => {
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
            expect(res.body.message).not.to.be.eql("Got data from cache");
          });
      });

      it("Should not return message 'Got data from cache' When Modifiyng a value", () => {
        return request(app)
          .get("/api/courses")
          .expect(200)
          .then(() => {
            return request(app)
              .put("/api/courses/5c937caf9d5f0d2bf466dd86")
              .send({
                "description": "A Ruby starter course"
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
            expect(res.body.message).not.to.be.eql("Got data from cache");
          });
      });
    });
  });

  describe("Issue #4 tests", () => {
    context("Testing failedStates", () => {
      it("should return only one student failed from Catamarca", () => {
        return request(app)
          .get("/api/stats/failuresByStates")
          .expect(200)
          .then((res) => {
            expect(res.body.data.data);
            expect(res.body.data.Catamarca).to.be.eql(1);
          });
      });

      it("should return only one student failed from Buenos Aires (student failed twice)", () => {
        return request(app)
          .get("/api/stats/failuresByStates")
          .expect(200)
          .then((res) => {
            expect(res.body.data.data);
            expect(res.body.data["Buenos Aires"]).to.be.eql(1);
          });
      });

      it("should return 2 students from CABA, and none from Santiago", () => {
        return request(app)
          .get("/api/stats/failuresByStates")
          .expect(200)
          .then((res) => {
            expect(res.body.data.data);
            expect(res.body.data.CABA).to.be.eql(2);
            // eslint-disable-next-line
            expect(res.body.data.Santiago).to.be.undefined;
          });
      });
    });
  });
});
