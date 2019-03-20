const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Technology = mongoose.model("Technology"),
  Student = mongoose.model("Student"),
  Evaluation = mongoose.model("Evaluation"),
  Course = mongoose.model("Course");

let createdTechnologies = [];
let createdCourses = [];
let createdStudents = [];
let createdEvaluations = [];

let billsCount = 0;
let billsData = [];

describe("node-course-test", () => {

    before(async () => {

        await Course.deleteMany({})
        await Technology.deleteMany({});
        await Student.deleteMany({});
        await Evaluation.deleteMany({});

        console.log("Collections cleaned!");

        createdTechnologies = await Technology.create({
            name: "NodeJs",
            technologyId: "JS-000"
        },{
            name: "VueJs",
            technologyId: "JS-001"
        });

        createdStudents = await Student.create({
            "firstName" : "Kris",
            "lastName" : "Breitenberg",
            "billingAddress" : {
                "street1" : "01285 Glover Spur",
                "city" : "Fritschville",
                "state" : "Delaware",
                "zipCode" : "34216",
                "country" : "Somalia"
            },
            "creditCards" : []
        }, {
            "firstName" : "Westley",
            "lastName" : "Mann",
            "billingAddress" : {
                "street1" : "474 Mraz Glen",
                "city" : "Dariusfort",
                "state" : "Kentucky",
                "zipCode" : "67720-1349",
                "country" : "Cameroon"
            },
            "creditCards" : [ 
                {
                    "firstName" : "Cecil",
                    "lastName" : "Shields",
                    "last4Numbers" : 5175,
                    "creditCardAPIToken" : "560e28e7-91c1-4a3b-acb9-dcbedb42328a",
                    "isDefault" : false
                }
            ],
        }, {
            "firstName" : "Garrison",
            "lastName" : "Cormier",
            "billingAddress" : {
                "street1" : "265 Daryl Station",
                "city" : "West Royceview",
                "state" : "Wisconsin",
                "zipCode" : "01231",
                "country" : "Holy See (Vatican City State)"
            },
            "creditCards" : [ 
                {
                    "firstName" : "Berneice",
                    "lastName" : "Von",
                    "last4Numbers" : 7046,
                    "creditCardAPIToken" : "7ae905f8-7539-4952-8084-7a7a2b4155c6",
                    "isDefault" : false
                }, 
                {
                    "firstName" : "Bernadine",
                    "lastName" : "Pollich",
                    "last4Numbers" : 1034,
                    "creditCardAPIToken" : "9d4d0af5-ae1e-4aa7-8ab0-08c85ae94fa2",
                    "isDefault" : true
                }, 
                {
                    "firstName" : "Casimer",
                    "lastName" : "Koch",
                    "last4Numbers" : 1808,
                    "creditCardAPIToken" : "3c2fef30-8102-4fd4-b2fe-ec668bcd1d8a",
                    "isDefault" : false
                }
            ]
        })

        createdCourses = await Course.create({
            technologyId: createdTechnologies[0].technologyId,
            date: { from: new Date("2019-05-01T00:00:00.000Z"), to: new Date("2019-05-15T00:00:00.000Z") },
            description: "Node Js course",
            status: "new",
            classes: [],
            price: 1000
        }, {
            technologyId: createdTechnologies[0].technologyId,
            date: { from: new Date("2019-05-01T00:00:00.000Z"), to: new Date("2019-05-15T00:00:00.000Z") },
            description: "Node Js course 2",
            status: "new",
            classes: [],
            price: 2000
        }, {
            technologyId: createdTechnologies[1].technologyId,
            date: { from: new Date("2019-05-01T00:00:00.000Z"), to: new Date("2019-05-15T00:00:00.000Z") },
            description: "Node Js course 2",
            status: "finished",
            classes: [],
            students: createdStudents,
            price: 3000
        });

        createdEvaluations = await Evaluation.create({
            "courseId" : createdCourses[2]._id,
            "date" : {
                "from" : new Date("2019-03-01T00:00:00.000Z"),
                "to" : new Date("2019-03-02T00:00:00.000Z")
            },
            "abstract" : "Written evaluation",
            "notes" : [ 
                {
                    "studentId" : createdStudents[0]._id,
                    "qualification" : 10,
                    "status" : "passed"
                },
                {
                    "studentId" : createdStudents[1]._id,
                    "qualification" : 5,
                    "status" : "passed"
                },
                {
                    "studentId" : createdStudents[2]._id,
                    "qualification" : 2,
                    "status" : "failed"
                }
            ],
        });

        console.log("Collections created!");

        let billsRes = await request(app).get(`/api/admin/billing/getChargeableStudents`)
        
        billsData = billsRes.body.data.studentsBillingInfo;
        billsCount = billsData.length;
        
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

    describe("Issue 2: create a GET /admin/billing/getInvoices", () =>  {
        const path =  '/api/admin/billing/getInvoices'
        context("#GET admin/billing/getInvoices", () => {{
            let promises = []
            it("should't fail on multiple calls", () => {
                for (let i=0 ; i<20 ; i++ ) {
                    promises.push(request(app)
                    .get(`${path}`)
                    .expect(200))
                }
                return Promise.all(promises);
            });
            
            it("should return an array of size "+billsCount+" containing invoice data", () => {
                return request(app)
                    .get(`${path}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body.status).to.eql("success");
                        expect(res.body.data.data.length).to.eql(billsCount);
                        for (let i = 0 ; i < res.body.data.data.length ; i ++) {
                            expect(res.body.data.data[i].price).to.eql(billsData[i].price);
                        }
                    });
            });
            
        }})

    })

    describe("Issue 3: Add Middleware for caching GET requests", () =>  {

        context("Call #GET courses twice", () => {{
            
            it("should take less time on second request ", () => {
                promises.push(request(app)
                .get(`${path}`)
                .expect(200))
            });
            
        }})

    })
    
});

