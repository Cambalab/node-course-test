const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Technology = mongoose.model("Technology"),
  Course = mongoose.model("Course");

let createdTechnologies = [];
let createdCourses = [];

describe("node-course-test", () => {

    beforeEach(() => {
        return Promise.all([Course.deleteMany({}),Technology.deleteMany({})])
            .then(() => {
                console.log("Collections cleaned!");
                let pTechs = Technology.create({
                                            name : "NodeJs",
                                            technologyId : "JS-000"
                                        });

                let pCourses = Course.create({
                                        technologyId : "JS-000",
                                        date : {from : new Date("2019-05-01T00:00:00.000Z"),to: new Date("2019-05-15T00:00:00.000Z")},
                                        description : "Node Js course",
                                        status : "new",
                                        classes: [],
                                        price: 1000 
                                    },{
                                        technologyId : "JS-000",
                                        date : {from : new Date("2019-05-01T00:00:00.000Z"),to: new Date("2019-05-15T00:00:00.000Z")},
                                        description : "Node Js course 2",
                                        status : "new",
                                        classes: [],
                                        price: 2000 
                                    });

                return Promise.all([pTechs,pCourses]);
            })
            .then(([techs,courses]) => {
                console.log("Collections created!",techs,courses);
                createdTechnologies.push(techs);
                createdCourses.push(courses);
            });
    });

    describe("Issue 1: Add filter by technologyId for GET /courses endpoint", () => {
        const path =  '/api/courses?technologyId'
        context("#GET api/courses?technologyId", () => {{
            it("should return empty array", () => {
                return request(app)
                    .get(`${path}=NOTEXISTS`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body.status).to.eql("success");
                        expect(res.body.data.courses.length).to.eql(0);
                    });
            });

            it("should return an array of length 2", () => {
                return request(app)
                    .get(`${path}=${createdTechnologies[0].technologyId}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body.status).to.eql("success");
                        expect(res.body.data.courses.length).to.eql(2);
                    });
            });
        }})
    })
    
});

