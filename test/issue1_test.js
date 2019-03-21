const app = require("../app.js");
const expect = require("chai").expect;
const request = require("supertest");
const mongoose = app.get("mongoose");
// const Task = mongoose.model("Task");
const path = "/api/courses";


describe("Bantics Test for Issue number 1", () => {
  context("#GET api/courses ", () => {
    describe("Get All", () => {
      it("should get all Courses", () => {
        return request(app)
          .get(path)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(3);
          });
      });
    });

    describe("filter", () => {
      it("should filter Courses by status", () => {
        return request(app)
          .get(`${path}?status=finished`)
          .expect(200)
          .then((res) => {
            //  console.log(res);
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(2);
          });
      });

      it("should filter Courses by tecnologyId", () => {
        return request(app)
          .get(`${path}?technologyId=JS-000`)
          .expect(200)
          .then((res) => {
            //  console.log(res);
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(1);
          });
      });
    });
  });
});
