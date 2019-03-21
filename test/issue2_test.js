const app = require("../app.js");
const expect = require("chai").expect;
const request = require("supertest");
const mongoose = app.get("mongoose");
// const Task = mongoose.model("Task");
const path = "/api/admin/billing/getInvoices";
//api/admin/billing/getChargeableStudents

describe("Bantics Test for Issue Number 2", () => {
  context("#GET api/admin/billing/getInvoices", () => {
    describe("Get The invoices", () => {
      it("should get all Courses", () => {
        return request(app)
          .get(path)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.courses).to.be.an("array");
            expect(res.body.data.courses.length).to.eql(7);
          });
      });
    });
  });
});
