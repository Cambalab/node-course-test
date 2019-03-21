const app = require("../app.js");
const expect = require("chai").expect;
const request = require("supertest");
const mongoose = app.get("mongoose");
const Course = mongoose.model("Course");
const Evaluation = mongoose.model("Evaluation");
const Student = mongoose.model("Student");

const path = "/api/stats/failuresByStates";

describe("Fail by states controllers tests", () => {
  beforeEach(() => {
    return Course.deleteMany({})
      .then(() => {
        console.log("Courses collection cleaned!");
        return Promise.all([
          Student.create({
            id: "1",
            firstName: "pedro",
            lastName: "Routaboul",
            billingAddress: {
              street1: "457 Ursula Port",
              city: "East Cicero",
              state: "Kentucky",
              zipCode: "71767-9748",
              country: "Argentina"
            }
          }),
          Student.create({
            id: "2",
            firstName: "romeo",
            lastName: "Routaboul",
            billingAddress: {
              street1: "457 Ursula Port",
              city: "East Cicero",
              state: "Kentucky",
              zipCode: "71767-9748",
              country: "Paraguay"
            }
          }),
          Course.create({
            technologyId: "PY-004",
            date: {
              from: new Date(),
              to: new Date()
            },
            description: "Programing whit Python 4",
            status: "ongoing",
            classes: [{
              name: "First step with python 4",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing code with python 4",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing advanced code with python 4",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            }
            ],
            studens: [
              "123123",
              "234234",
              "345345"
            ],
            price: 15000
          }),
          Evaluation.create({
            courseId: "qwe123",
            date: {
              from: new Date(),
              to: new Date()
            },
            abstract: "Test",
            note: [{
              studentId: "1",
              qualification: 2,
              status: "failed"
            },
            {
              studentId: "2",
              qualification: 2,
              status: "failed"
            },
            {
              studentId: "2",
              qualification: 2,
              status: "failed"
            }
            ]
          })
        ]);
      })
      .then(() => {
      });
  });

  context("GET /stats/failuresByStates", () => {
    it("should return an object whit countrys and their fails", () => {
      return request(app)
        .get(path)
        .send()
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.Argentina).to.eql(1);
          expect(res.body.data.Paraguay).to.eql(1);
        });
    });
  });
});
