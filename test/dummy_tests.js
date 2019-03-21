const expect = require("chai").expect;
const request = require("supertest");
const app = require("../app");
const mongoose = app.get("mongoose");
const Technology = mongoose.model("Technology");
const Course = mongoose.model("Course");
const Evaluation = mongoose.model("Evaluation");
const Student = mongoose.model("Student");
describe("Issue #1 test", () => {
  const PATH = "/api/courses";
  before(async () => {
    await Technology.deleteMany({});
    await Course.deleteMany({});
    const techs = [{
      "name": "NodeJs",
      "technologyId": "JS-000"
    },
    {
      "name": "VueJs",
      "technologyId": "JS-001"
    }];
    const courses = [
      {
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
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            "tags": ""
          },
          {
            "name": "Programming with Node JS",
            "description": "A class to continue programming with Node JS",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            "tags": ""
          },
          {
            "name": "Programming advanced with Node JS",
            "description": "A class to program with Node JS",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            "tags": ""
          }
        ],
        "price": 123400,
        "students": []
      },
      {
        "technologyId": "JS-001",
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
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            "tags": ""
          },
          {
            "name": "Programming with Node JS",
            "description": "A class to continue programming with Node JS",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            "tags": ""
          },
          {
            "name": "Programming advanced with Node JS",
            "description": "A class to program with Node JS",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
            "tags": ""
          }
        ],
        "price": 123400,
        "students": []
      }
    ];
    return Promise.all([Technology.insertMany(techs), Course.insertMany(courses)]);
  });


  it("/courses should be able to filter by technologyId", () => {
    return request(app)
      .get(`${PATH}?technologyId=JS-000`)
      .expect(200)
      .then((res) => {
        expect(res.body.data.courses).to.be.an("array");
        expect(res.body.data.courses.length).to.be.eql(1);
        expect(res.body.data.courses[0].technologyId).to.be.eql("JS-000");
      });
  });
});

describe("Issue #2 test", () => {
  const PATH = "/api/admin/billing/getInvoices";
  before(async () => {

  });

  it("/getInvoices returns the list of students with their respective invoice", () => {
    return request(app)
      .get(PATH)
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

describe("Issue #3 tests", () => {
  context("Testing cache MiddleWare", () => {
    it("Should return message 'Cached'", () => {
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
          expect(res.body.message).to.be.eql("Cached");
        });
    });

    it("Should not return message 'Cached' When Posting new Course", () => {
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
          expect(res.body.message).not.to.be.eql("Cached");
        });
    });

    it("Should not return message 'Cached' When Modifiyng a value", () => {
      Course.find().then((courses) => {
        const course = courses[0];
        return request(app)
          .get("/api/courses")
          .expect(200)
          .then(() => {
            return request(app)
              .put(`/api/courses/${course._id}`)
              .send({
                "description": "A Ruby starter couasrse"
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
            expect(res.body.message).not.to.be.eql("Cached");
          });
      });
    });
  });
});

describe("Issue #4 test", () => {
  const PATH = "/api/stats/failuresByStates";
  before(async () => {
    await Student.deleteMany({});
    await Evaluation.deleteMany({});
    const students = [{
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
    }];
    const evaluations = [{
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
          "qualification": 9,
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
          "qualification": 9,
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
          "qualification": 9,
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
          "qualification": 9,
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
          "qualification": 9,
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
    }];
    return Promise.all([Student.insertMany(students), Evaluation.insertMany(evaluations)]);
  });

  it("failuresByStates returns the Number of students by city that have failed an evaluation - One evaluation", () => {
    return request(app)
      .get(PATH)
      .expect(200)
      .then((res) => {
        expect(res.body.data.data);
        console.log(res.body.data);
        expect(res.body.data.Catamarca).to.be.eql(1);
      });
  });

  it("failuresByStates returns the Number of students by city that have failed an evaluation - Two evaluations same student", () => {
    return request(app)
      .get(PATH)
      .expect(200)
      .then((res) => {
        expect(res.body.data.data);
        expect(res.body.data["Buenos Aires"]).to.be.eql(1);
      });
  });

  it("failuresByStates returns the Number of students by city that have failed an evaluation - Two evaluations diff student", () => {
    return request(app)
      .get(PATH)
      .expect(200)
      .then((res) => {
        expect(res.body.data.data);
        expect(res.body.data.CABA).to.be.eql(2);
      });
  });

  it("failuresByStates returns the Number of students by city that have failed an evaluation - All approved", () => {
    return request(app)
      .get(PATH)
      .expect(200)
      .then((res) => {
        expect(res.body.data.data);
        // eslint-disable-next-line
        expect(res.body.data.Santiago).to.be.undefined;
      });
  });
});
