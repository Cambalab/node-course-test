# node-course-test-resolve

We had to re run the mongo docker (we had installed in a docker instance because in debian 10 testing are not a candidate in official repo. We tried to install directly via the package but has dependency problems) for expose a volume, then copy the dump, and execute the mongorestore.

 sudo docker run -p 27017:27017 -v /home/rfpolverini/repoBantics/mongo/:/etc/mongo --name some-mongo -d mongo:3.4.20

sudo docker exec -i some-mongo mongorestore /etc/mongo/dump

Issue 1
We made the test, trying to acomplish the requeriment of the first issue.

We saw that the genericController implement a generic FilterQuery . The fields of this queryBuilder is defined in each specific controller, then we add the required field in the filterFields array.
We saw too that the buildFilterQuery function had linter error, we redefined it

Issue 2
We try to made a test for this issue, we see that a get in http://localhost:8000/api/admin/billing/getChargeableStudents response with '7' Students, then we expected an array with 7 objects in the response, one for each possible invoice.


We are going Crazy with the async and promises...
We tried to make it Sync Without success because the request allways seems to be async... and the result object is filled empty .
We tried to use async, with await, .then chain, etc.. but nothing seems to work like we excpect.
