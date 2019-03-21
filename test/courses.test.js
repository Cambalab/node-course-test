const app = require("../app.js");
const expect = require("chai").expect;
const request = require("supertest");
const mongoose = app.get("mongoose");
const Course = mongoose.model("Course");
const path = "/api/courses";

describe("Courses controllers tests", () => {
  beforeEach(() => {
    return Course.deleteMany({})
      .then(() => {
        console.log("Courses collection cleaned!");
        return Promise.all([
          Course.create({
            technologyId: "PY-001",
            date: {
              from: new Date(),
              to: new Date()
            },
            description: "Programing whit Python",
            status: "new",
            classes: [{
              name: "First step with python",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing code with python",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing advanced code with python ",
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
          Course.create({
            technologyId: "PY-002",
            date: {
              from: new Date(),
              to: new Date()
            },
            description: "Programing whit Python 2",
            status: "registration open",
            classes: [{
              name: "First step with python 2",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing code with python 2",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing advanced code with python 2",
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
          Course.create({
            technologyId: "PY-003",
            date: {
              from: new Date(),
              to: new Date()
            },
            description: "Programing whit Python 3",
            status: "new",
            classes: [{
              name: "First step with python 3",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing code with python 3",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel est in dolor ultricies blandit ut eu magna. Mauris tristique nisi a dignissim eleifend. In vitae tellus vitae massa faucibus aliquam vitae eu neque. Nulla finibus neque turpis, ut sagittis magna aliquam vulputate.",
              tags: ["code", "python", "beginers"]
            },
            {
              name: "Writing advanced code with python 3",
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
          })
        ]);
      })
      .then((data) => {
        createdCourses = data;
      });
  });

  context("GET api/courses", () => {
    it("should filter by tecnologyId", () => {
      return request(app)
        .get(`${path}?technologyId=PY-004`)
        .send()
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.courses).to.be.an("array");
          expect(res.body.data.courses.length).to.eql(1);
        });
    });
  });
});
