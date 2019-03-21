const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  path = "/api/stats/failuresByStates",
  Student = mongoose.model("Student"),
  Course = mongoose.model("Course")
  Evaluation = mongoose.model("Evaluation");

describe("Courses controller tests", () => {

  beforeEach(() => {
    return Promise.all([
      Student.deleteMany({}),
      Course.deleteMany({}),
      Evaluation.deleteMany({})
      ])
      .then(async () => {
        console.log("Students, courses and evaluations cleaned!");
        let students = await Promise.all([
          Student.create({
            "firstName" : "Kris",
            "lastName" : "Breitenberg",
            "billingAddress" : {
                "street1" : "01285 Glover Spur",
                "city" : "Fritschville",
                "state" : "Delaware",
                "zipCode" : "34216",
                "country" : "Somalia"
            },
            "creditCards" : []
          }),
          Student.create({
            "firstName" : "Westley",
            "lastName" : "Mann",
            "billingAddress" : {
                "street1" : "474 Mraz Glen",
                "city" : "Dariusfort",
                "state" : "Kentucky",
                "zipCode" : "67720-1349",
                "country" : "Cameroon"
            },
            "creditCards" : [ 
                {
                    "firstName" : "Cecil",
                    "lastName" : "Shields",
                    "last4Numbers" : 5175,
                    "creditCardAPIToken" : "560e28e7-91c1-4a3b-acb9-dcbedb42328a",
                    "isDefault" : false
                }
            ]
          }),
          Student.create({
            "firstName" : "Garrison",
            "lastName" : "Cormier",
            "billingAddress" : {
                "street1" : "265 Daryl Station",
                "city" : "West Royceview",
                "state" : "Wisconsin",
                "zipCode" : "01231",
                "country" : "Holy See (Vatican City State)"
            },
            "creditCards" : [ 
                {
                    "firstName" : "Berneice",
                    "lastName" : "Von",
                    "last4Numbers" : 7046,
                    "creditCardAPIToken" : "7ae905f8-7539-4952-8084-7a7a2b4155c6",
                    "isDefault" : false
                }, 
                {
                    "firstName" : "Bernadine",
                    "lastName" : "Pollich",
                    "last4Numbers" : 1034,
                    "creditCardAPIToken" : "9d4d0af5-ae1e-4aa7-8ab0-08c85ae94fa2",
                    "isDefault" : true
                }, 
                {
                    "firstName" : "Casimer",
                    "lastName" : "Koch",
                    "last4Numbers" : 1808,
                    "creditCardAPIToken" : "3c2fef30-8102-4fd4-b2fe-ec668bcd1d8a",
                    "isDefault" : false
                }
            ]
          }) 
        ]);
        let courses = await Promise.all([
          Course.create({
            "technologyId" : "JS-000",
            "description" : "Node Js course",
            "date" : {
              "from" : new Date("2019-05-01T00:00:00.000Z"),
              "to" : new Date("2019-05-15T00:00:00.000Z")
            },
            "status" : "new",
            "price" : 123409,
            "students" : [students[0]._id.toString()]
          }),
          Course.create({
            "technologyId" : "JS-001",
            "description" : "VUE Js course",
            "date" : {
              "from" : new Date("2019-02-01T00:00:00.000Z"),
              "to" : new Date("2019-02-28T00:00:00.000Z")
            },
            "status" : "finished",
            "price" : 11111,
            "students" : [students[1]._id.toString(), students[2]._id.toString()]
          })     
        ]);
        let evaluations  = await Promise.all([
          Evaluation.create({
            "courseId" : courses[1]._id.toString(),
            "date" : {
                "from" : new Date("2019-03-01T00:00:00.000Z"),
                "to" : new Date("2019-03-02T00:00:00.000Z")
            },
            "abstract" : "Written evaluation",
            "notes" : [ 
                {
                    "studentId" : students[1]._id.toString(),
                    "qualification" : 10,
                    "status" : "failed"
                }, 
                {
                    "studentId" : students[2]._id.toString(),
                    "qualification" : 9,
                    "status" : "failed"
                }
              ]
            })         
        ])
      }) //fin then
      .catch(err => {
        console.log(`ERROR inserting data for test`)
      })
  })

  context("#GET /stats/failuresByStates", () => {

    it("should get all students that failed exams grouped by state", () => {
      return request(app)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data).to.be.an("object");
          expect(Object.keys(res.body.data).length).to.eql(2);
          expect(res.body.data).to.have.property("Wisconsin");
          expect(res.body.data["Wisconsin"]).to.equal(1); //
        });
    });

  });

});
