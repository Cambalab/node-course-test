const app = require("../app.js"),
  {expect} = require("chai"),
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  path = "/api/admin/billing/getInvoices";

describe("Invoices tests", () => {

  beforeEach(() => {
  });

  context("#GET /getInvoices", () => {

    it("should get all invoices", () => {
      return request(app)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.afipInvoices).to.be.an("array");
          expect(res.body.data.afipInvoices.length).to.eql(7);
        });
    });

  });

});
