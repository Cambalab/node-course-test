const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Course = mongoose.model("Course"),
  Student = mongoose.model("Student"),
  Evaluation = mongoose.model("Evaluation"),
  path1 = "/api/admin/billing/getChargeableStudents";
  path2 = "/api/admin/billing/getInvoices";

describe("Get controller billing", () => {

    beforeEach(() => {
    return Promise.all([
      Course.deleteMany({}),
      Student.deleteMany({}),
      Evaluation.deleteMany({})
    ])
      .then(() => {
        console.log("Course, Student and  Evaluation collections cleaned!");
        return Promise.all([
          Course.create({
          _id: "5c8bfa7d89a91670892d7b2d",
          technologyId : "EL-000",
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
          ]}),
          Evaluation.create({
              "date": {
                  "from": "2019-03-01T00:00:00.000Z",
                  "to": "2019-03-02T00:00:00.000Z"
              },
              "_id": "5c8bffd489a91670892d7e12",
              "courseId": "5c8bfa7d89a91670892d7b2d",
              "abstract": "Written evaluation",
              "notes": [
                  {
                      "studentId": "5c8be6ec89a91670892d7317",
                      "qualification": 10,
                      "status": "passed"
                  },
                  {
                      "studentId": "5c8be6ec89a91670892d7318",
                      "qualification": 9,
                      "status": "passed"
                  }
              ]
          }),
          Student.create({
            "_id": "5c8be6ec89a91670892d7317",
            "firstName": "Kris",
            "lastName": "Breitenberg",
            "billingAddress": {
                "_id": "5c928adf53baaa5e21852440",
                "street1": "01285 Glover Spur",
                "city": "Fritschville",
                "state": "Delaware",
                "zipCode": "34216",
                "country": "Somalia"
            },
            "creditCards": []
          }),
          Student.create({
            "_id": "5c8be6ec89a91670892d7318",
            "firstName": "Westley",
            "lastName": "Mann",
            "billingAddress": {
                "_id": "5c928b2553baaa5e21852441",
                "street1": "474 Mraz Glen",
                "city": "Dariusfort",
                "state": "Kentucky",
                "zipCode": "67720-1349",
                "country": "Cameroon"
            },
            "creditCards": [
                {
                    "firstName": "Cecil",
                    "lastName": "Shields",
                    "last4Numbers": 5175,
                    "creditCardAPIToken": "560e28e7-91c1-4a3b-acb9-dcbedb42328a",
                    "isDefault": false
                }
            ]
          })
        ]);
      })
      .then((data) => {
      
      });
  });

  context("#GET /admin/billing", () => {

    it("should get Invoice", () => {
      return request(app)
        .get(path2)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data).to.be.an("array");
          expect(res.body.data.length).to.eql(2);
        });
    });

  });

});
