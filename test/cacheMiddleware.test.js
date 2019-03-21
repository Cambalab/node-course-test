const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest");

describe("Cache middleware tests", () => {

  let paths = [
    "/api/evaluations",
    "/api/students",
    "/api/technologies",
    "/api/courses",
    "/api/admin/billing/getChargeableStudents",
  ],
    results = [];

  beforeEach(() => {
    app.get("cache").clear();
    console.log("Cache cleaned!");
    return Promise.all([
      request(app).get(paths[0]),
      request(app).get(paths[1]),
      request(app).get(paths[2]),
      request(app).get(paths[3]),
    ])
    .then((data) => {
      results = data.map(d => d.body.data);
    });
  });

  context.only("GET request", () => {

    it("should cache all routes once", () => {
      return request(app)
        .get(paths[0])
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(app.get("cache").list()).to.be.an("array");
          expect(app.get("cache").list().length).to.eql(4);
        });
    });

    it.skip("should cache routes response", () => {
      return request(app)
        .get(paths[3])
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(results.include(app.get("cache").get(paths[0]))).to.be(true);
        });
    });

    it("should not cache bill route", () => {
      return request(app)
        .get(paths[4])
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(app.get("cache").belongs(paths[4])).to.eql(false);
        });
    });

  });

});
