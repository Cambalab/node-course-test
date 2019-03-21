const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Course = mongoose.model("Course"),
  path = "/api/courses";

describe("Courses controller tests", () => {

  let createdCourses = null,
    course1 = null,
    course2 = null,
    techId1 = "Node1",
    techId2 = "Node2",
    techId3 = "Node3";

  beforeEach(() => {
    return Course.deleteMany({})
      .then(() => {
        console.log("Courses collection cleaned!");
        return Promise.all([
          Course.create({
            technologyId: "Node1", 
            date: {
              from: new Date().setDate(1), 
              to: new Date().setDate(2)
            }, 
            status: "new",
            description: "a good description", 
            price: 123,
          }),
          Course.create({
            technologyId: "Node2", 
            date: {
              from: new Date().setDate(1), 
              to: new Date().setDate(2)
            }, 
            status: "ongoing",
            description: "a good description", 
            price: 123,
          }),
          Course.create({
            technologyId: "Node3", 
            date: {
              from: new Date().setDate(1), 
              to: new Date().setDate(2)
            }, 
            status: "ongoing",
            description: "a good description", 
            price: 123,
          })
        ]);
      })
      .then((data) => {
        createdCourses = data;
        course1 = data[0];
        course2 = data[1];
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
          expect(res.body.data.courses.length).to.eql(3);
        });
    });

    describe("filter", () => {
  
      it("should filter courses by status - happy", () => {
        return request(app)
          .get(`${path}?status=${course1.status}`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(1);
            expect(res.body.data.courses[0]._id.toString()).to.eql(course1._id.toString());
          });
      });

      it("should filter courses by status - unhappy", () => {
        return request(app)
          .get(`${path}?status=notAValidStatus`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(0);
          });
      });

      it("should filter courses by technologyId - happy", () => {
        return request(app)
          .get(`${path}?technologyId=${course2.technologyId}`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(1);
            expect(res.body.data.courses[0]._id.toString()).to.eql(course2._id.toString());
          });
      });

      it("should filter courses by technologyId - unhappy", () => {
        return request(app)
          .get(`${path}?technologyId=notAValidTechnologyId`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(0);
          });
      });

    });

  });

});
