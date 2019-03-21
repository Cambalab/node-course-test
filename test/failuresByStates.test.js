const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Course = mongoose.model("Course"),
  path = "/api/stats/failuresByStates";

describe("Courses controller tests", () => {

  beforeEach(() => {})

  context("#GET /failuresByStates", () => {

    it("should get failure count for each state", () => {
      return request(app)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.failuresBystate).to.be.an("object");
          expect(Object.keys(res.body.data.failuresBystate).length).to.eql(1);
          expect(res.body.data.failuresBystate[Object.keys(res.body.data.failuresBystate)[0]]).to.eql(2);
        });
    });

  });

});
