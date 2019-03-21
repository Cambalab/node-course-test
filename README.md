# node-course-test
Exam repo for Fiqus' [node-course](https://github.com/fiqus/node-course) by Cambá.

### Contents
- [Installation](/README.md#installation)
- [Domain description](/DESCRIPTION.md)
- [Excercises](/README.md#excercises)
- [Evaluation criteria](/README.md#evaluation-criteria)
- [API](/API.md)

## Installation
In the project root run:
```
npm install
mongorestore ./dump
```

## Excercises
1. [Add filter by technologyId for GET api/courses endpoint](https://github.com/Cambalab/node-course-test/issues/1)
2. [create a GET api/admin/billing/getInvoices](https://github.com/Cambalab/node-course-test/issues/2)
3. [Add Middleware for caching GET requests](https://github.com/Cambalab/node-course-test/issues/3)
4. [create GET api/stats/mostFailedStates](https://github.com/Cambalab/node-course-test/issues/4)

## Evaluation criteria

To pass this exam all excercises must be resolved, every feature must be tested (with all tests passing) and there must be no linting errors.

Summission must be done through a single Pull Request.

## Responses 

## Models 

    As a general observation, I considera that the model of the app seems
    very well dessigned.
    As a suggestion of what I may change, taking into account that one 
    of the exercises asks for the amount of students that failed the exam
    by each state, and the posible way to get it is by looking for the 
    state as a string, I think it would be better to create other entity (schema)
    that has the country, the state, postal code and the id. So that, 
    we could have filter by state in a neatter way.
    On the other hand, I may add some relationships to all the squema 
    that I have done on mongoose. For example: to relate the student
    to his/her exam.


## 1) Issue 1 - Implementation plan:

1 - I solved this issue just adding the parameter "technologyId" 
    to the filter parameters Array that already implemented. 
    It was simple due to the structure of the implemetation
    and the filtering query mode.

## 2) Issue 2 - Implementation plan:

    1- I decided to create a new endpoint that calls one which I developed previously,
    by using a request to avoid to modify it.
    From the response I can get the students that have to pay the course.

    2- This data is used to make a call to the AFIP API in order 
    to get the corresponding id for each student. Then I used destructuring,
    which allowed me to made it easier, to give format to the object that
    will be send as the response required on this exercise.


## 3) Issue 3 - Implementation plan:

    1 - To solve this issue, firstly I create an array with URLs that are excluded from the middleware.
    This is a scalable solution like the Issue 1, due to exclude other URL just need to add it 
    to the array that I mention before.

    2 - Secondly, I ask who request method are using and depend if is a GET,
    PUT or POST I do different things. Always I ask if that request is
    in the local cache, and depending if is a POST or a PUT y delete from 
    cache with a different form.

    3 - Also I redefined the response200 , in this way I able to get the data 
    in the callback to save it into cache and added to the new response.


## 4) Issue 4 - Implementation plan:

    1- Since there is an exams list and each exam has a list of marks, 
    I decided to create a new list with all those marks that represent a failed exam.

    2- With this new list of failed marks,
    I looked for each student that was related with each mark creating a new list. 
    Taking into account this can result on duplicated students, 
    due to the fact that they could failed more than one exam, 
    I decided to use a dictionary structure to map each student 
    with his/her city with a function that verify that the student wasnt 
    added before.

## Tests

According to the test, I would have prefer to developed some better tests for the app,
I think I could not dedicate enough time to do it, but I'm aware about the need to develop some more of them and on a neatter way.