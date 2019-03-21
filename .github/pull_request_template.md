**Name:** Your Name

## Explain your solution
Tell us how you solved each of the excercises.

#### Excercise 1 - Add filter by technologyId for GET /courses endpoint
- First of all, I writed tests for Courses Controller. I tested Get api/courses return all courses loaded and then I tested courses' filters: by status (already implemented) and by technologyId (not). For each filter I implemented 2 tests: one for the happy scenario when the filter's value match one element and other for the unhappy scenario when it does not match any. The first 3 tests  passed but the last 2 not, so I started with TDD.
- The new filter's implementation was easy: just add a new filterField into filterFields list in Course Controller (line 3) with the 
rigth name and that's all. The last 2 tests passed.

#### Excercise 2 - create a GET /admin/billing/getInvoices
- I writed a test that just call the endpoint and assert the number of billings invoices was the same as chargeable students. 
- The solution for Afip's api inestability was to recall the Afip's endpoint when get a request error and then populate the result. In most cases I got timeout error in tests but increasing it to 2000 ms helps to pass them in most cases, but in some runs it runs in more than that time.

#### Excercise 3 - Add Middleware for caching GET requests
- I created a module for managing Caché. That module has 2 methods: one for creating a new cache and the other one is the middleware that uses the cache. Cache is a simple map (object) that checks if url was called before and returns that value. If the url is called with POST or PUT method, cache clears the entry.

#### Excercise 4 - create GET /stats/failuresByStates
- I writed a test that just call the endpoint and assert the number of states with students who didnt pass was the same as in db (1) and has the same number of students (2). 
- The route controller first filter finished courses, then filter every note in their evaluations that was failed and get its student. I maked a Set with those students and for each one, I get his state. Then count every state apareance and map it with their name.

## Share your ideas about the application

- Would you change anything about how the app was designed?

- What else would you add to it?

