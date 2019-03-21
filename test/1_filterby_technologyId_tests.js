const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Course = mongoose.model("Course"),
  path = "/api/courses";

describe("Course controller tests", () => {

    let createdCourses = null,
    course1 = null;

    beforeEach(() => {
    return Course.deleteMany({})
      .then(() => {
        console.log("Course collection cleaned!");
        return Promise.all([
          Course.create({technologyId : "JS-000", date : {
            "from" : new Date().setDate(1),
            "to" : new Date().setDate(4)
        }, description : "Node Js course", status : "new", price : 123400,students : []}),
          Course.create({technologyId : "JS-001",
          date : {
            "from" : new Date().setDate(1),
            "to" : new Date().setDate(4)
        }, description : "Vue Js course", status : "finished", price : 432100, students : [
              "5c8be6ec89a91670892d731a",
              "5c8be6ec89a91670892d731b",
              "5c8be6ec89a91670892d731c",
              "5c8be6ec89a91670892d731d",
              "5c8be6ec89a91670892d731e"
          ]}),
          Course.create({technologyId : "EL-000",
          date : {
            "from" : new Date().setDate(1),
            "to" : new Date().setDate(4)
        },
         description : "Erlang course", status : "finished", price : 500000, students : [
              "5c8be6ec89a91670892d7317",
              "5c8be6ec89a91670892d7318",
              "5c8be6ec89a91670892d7319",
              "5c8be6ec89a91670892d731a",
              "5c8be6ec89a91670892d731b",
              "5c8be6ec89a91670892d731c"
          ]})
        ]);
      })
      .then((data) => {
        createdCourses = data;
        course1 = data[0];
      });
  });

  context("#GET /api/courses", () => {

    it("should get all course", () => {
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

      it("should filter courses by tecnologyId", () => {
        return request(app)
          .get(`${path}?technologyId=${course1.technologyId}`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(1);
            expect(res.body.data.courses[0].technologyId).to.eql("JS-000");
          });
      });

    });

  });

});
