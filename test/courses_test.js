const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  path = "/api/courses",
  Course = mongoose.model("Course");

describe("Courses controller tests", () => {

  let course1 = {
    "technologyId" : "JS-000",
    "description" : "Node Js course",
    "date" : {
      "from" : new Date("2019-05-01T00:00:00.000Z"),
      "to" : new Date("2019-05-15T00:00:00.000Z")
    },
    "status" : "new",
    "price" : 123400,
    "students" : []
  }

  beforeEach(() => {
    return Course.deleteMany({})
      .then(() => {
        console.log("courses collection cleaned!");
        return Promise.all([
          Course.create({
            "technologyId" : "JS-000",
            "description" : "Node Js course",
            "date" : {
              "from" : new Date("2019-05-01T00:00:00.000Z"),
              "to" : new Date("2019-05-15T00:00:00.000Z")
            },
            "status" : "new",
            "price" : 123400,
            "students" : []
          }),
          Course.create({
            "technologyId" : "JS-001",
            "description" : "VUE Js course",
            "date" : {
              "from" : new Date("2019-02-01T00:00:00.000Z"),
              "to" : new Date("2019-02-28T00:00:00.000Z")
            },
            "status" : "finished",
            "price" : 123456,
            "students" : []
          })     
        ]);
      })
      .then((data) => {
        course1 = data[0];
      });
  });

  context("#GET /courses", () => {

    it("should get all courses", () => {
      return request(app)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.courses).to.be.an("array");
          expect(res.body.data.courses.length).to.eql(2);
        });
    });

    describe("filter", () => {

      it("should filter courses by technologyId", () => {
        return request(app)
          .get(`${path}?technologyId=${course1.technologyId}`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(1);
            expect(res.body.data.courses[0].technologyId).to.eql(course1.technologyId);
          });
      });
  
      it("should filter courses by status", () => {
        return request(app)
          .get(`${path}?status=${course1.status}`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(1);
            expect(res.body.data.courses[0].status).to.eql(course1.status);
          });
      });

    });

    describe("execution Time", () => {
      it("should get all courses twice and compare the response time", async () => {
        let init = new Date();
        let resOne = await request(app)
          .get(path)
          .expect(200);
        let stopOne = new Date();
        let resTwo = await request(app)
          .get(path)
          .expect(200);
        let stopTwo = new Date();
        let firstExec = stopOne.getTime() - init.getTime();
        let secondExec = stopTwo.getTime() - stopOne.getTime();
        expect(secondExec <= firstExec).to.be.true;
      });
    });

  });

});
