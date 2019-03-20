# API
`basePath: "/api"`

### Courses

**getCourses**

`GET /courses` <br>
**method:** `GET` <br>
**route:** `/courses` <br>
**params:** `status: String`

**Request**
```
curl -X GET \
  'http://localhost:8000/api/courses?status=new'
```

**Response**

```
{
    "data": [
        {
            "date": {
                "from": "2018-10-20T00:00:00.000Z",
                "to": "2018-10-21T00:00:00.000Z"
            },
            "status": "new",
            "students": [
                "pepe"
            ],
            "_id": "5c897b3224df1045011bda48",
            "technologyId": "node",
            "description": "A NodeJS starter course",
            "classes": [
                {
                    "tags": [],
                    "_id": "5c897b3224df1045011bda49",
                    "name": "Class 1",
                    "description": "zaraza"
                }
            ],
            "__v": 0
        },
        {
            "date": {
                "from": "2018-10-20T00:00:00.000Z",
                "to": "2018-10-21T00:00:00.000Z"
            },
            "status": "new",
            "students": [],
            "_id": "5c8bf5bd9984df0c32c5e00f",
            "technologyId": "java",
            "description": "A Java starter course",
            "classes": [
                {
                    "tags": [],
                    "_id": "5c8bf5bd9984df0c32c5e010",
                    "name": "Class 1",
                    "description": "types"
                }
            ],
            "price": 3000,
            "__v": 0
        }
    ],
    "status": "success",
    "message": "Found '2' Courses."
}
```

----
**getCourse**

`GET /courses/:id` <br>
**method:** `GET` <br>
**route:** `/courses/:id` <br>
**params:** `-`

**Request**
```
curl -X GET \
  http://localhost:8000/api/courses/5c897b3224df1045011bda48
```

**Response**
```
{
    "data": {
        "date": {
            "from": "2018-10-20T00:00:00.000Z",
            "to": "2018-10-21T00:00:00.000Z"
        },
        "status": "new",
        "students": [
            "pepe"
        ],
        "_id": "5c897b3224df1045011bda48",
        "technologyId": "NodeJS",
        "description": "A NodeJS starter course",
        "classes": [
            {
                "tags": [],
                "_id": "5c897b3224df1045011bda49",
                "name": "Class 1",
                "description": "zaraza"
            }
        ],
        "__v": 0
    },
    "status": "success",
    "message": "Course '5c897b3224df1045011bda48' found."
}
```

----
**createCourse**

`POST /courses/:id` <br>
**method:** `GET` <br>
**route:** `/courses/:id` <br>
**params:** `-`

**Request**
```
curl -X POST \
  http://localhost:8000/api/courses \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
  "technologyId": "ruby",
  "date": {
    "from": "2018-10-20T00:00:00Z",
    "to": "2018-10-21T00:00:00Z"
  },
  "description": "A ruby starter course",
  "classes": [{"name": "Class 1", "description": "zaraza"}],
  "price": 3000,
  "students": ["pepe"]
}'
```

**Response**
```
{
    "data": {
        "status": "new",
        "students": [
            "pepe"
        ],
        "_id": "5c8c09ff444bfa0dfa450066",
        "technologyId": "ruby",
        "date": {
            "from": "2018-10-20T00:00:00.000Z",
            "to": "2018-10-21T00:00:00.000Z"
        },
        "description": "A Ruby starter course",
        "classes": [
            {
                "tags": [],
                "_id": "5c8c09ff444bfa0dfa450067",
                "name": "Class 1",
                "description": "zaraza"
            }
        ],
        "price": 3000,
        "__v": 0
    },
    "status": "success",
    "message": "Course '5c8c09ff444bfa0dfa450066' successfully created."
}
```

----
### Evaluations

**getEvaluations**

`GET /evaluations` <br>
**method:** `GET` <br>
**route:** `/evaluations` <br>
**params:** `-`

**Request**
```
curl -X GET \
  http://localhost:8000/api/evaluations
```

**Response**

```
{
    "data": [
        {
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
                },
                {
                    "studentId": "5c8be6ec89a91670892d7319",
                    "qualification": 8,
                    "status": "passed"
                },
                {
                    "studentId": "5c8be6ec89a91670892d731a",
                    "qualification": 7,
                    "status": "passed"
                },
                {
                    "studentId": "5c8be6ec89a91670892d731b",
                    "qualification": 9,
                    "status": "passed"
                },
                {
                    "studentId": "5c8be6ec89a91670892d731c",
                    "qualification": 2,
                    "status": "failed"
                }
            ]
        },
        {
            "date": {
                "from": "2019-03-01T00:00:00.000Z",
                "to": "2019-03-02T00:00:00.000Z"
            },
            "_id": "5c8c027889a91670892d7fa3",
            "courseId": "5c8bf88489a91670892d79ee",
            "abstract": "Written evaluation",
            "notes": [
                {
                    "studentId": "5c8be6ec89a91670892d731a",
                    "qualification": 10,
                    "status": "passed"
                },
                {
                    "studentId": "5c8be6ec89a91670892d731b",
                    "qualification": 9,
                    "status": "passed"
                },
                {
                    "studentId": "5c8be6ec89a91670892d731c",
                    "qualification": 2,
                    "status": "failed"
                },
                {
                    "studentId": "5c8be6ec89a91670892d731d",
                    "qualification": 7,
                    "status": "passed"
                },
                {
                    "studentId": "5c8be6ec89a91670892d731e",
                    "qualification": 9,
                    "status": "passed"
                }
            ]
        }
    ],
    "status": "success",
    "message": "Found '2' Evaluations."
}
```

----
**getEvaluation**

`GET /evaluations/:id` <br>
**method:** `GET` <br>
**route:** `/evaluations/:id` <br>
**params:** `-`

**Request**
```
curl -X GET \
  http://localhost:8000/api/evaluations/5c8bcfb8ab961670cdc783a5
```

**Response**
```
{
    "data": {
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
            },
            {
                "studentId": "5c8be6ec89a91670892d7319",
                "qualification": 8,
                "status": "passed"
            },
            {
                "studentId": "5c8be6ec89a91670892d731a",
                "qualification": 7,
                "status": "passed"
            },
            {
                "studentId": "5c8be6ec89a91670892d731b",
                "qualification": 9,
                "status": "passed"
            },
            {
                "studentId": "5c8be6ec89a91670892d731c",
                "qualification": 2,
                "status": "failed"
            }
        ]
    },
    "status": "success",
    "message": "Evaluation '5c8bffd489a91670892d7e12' found."
}
```
----
**createEvaluation**

`POST /evaluations/:id` <br>
**method:** `GET` <br>
**route:** `/evaluations/:id` <br>
**params:** `-`

**Request**
```
curl -X POST \
  http://localhost:8000/api/evaluations \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"courseId": "5c8c09ff444bfa0dfa450066",
	"date": {
    	"from": "2019-03-21T00:00:00Z",
    	"to": "2019-03-22T00:00:00Z"
	},
	"abstract": "The evaluation for the Ruby course. Write JS stuff to pass",
	"notes": []
}'
```

**Response**
```
{
    "data": {
        "_id": "5c8c0ead444bfa0dfa450068",
        "courseId": "5c8c09ff444bfa0dfa450066",
        "date": {
            "from": "2019-03-21T00:00:00.000Z",
            "to": "2019-03-22T00:00:00.000Z"
        },
        "abstract": "The evaluation for the Ruby course. Write JS stuff to pass",
        "notes": [],
        "__v": 0
    },
    "status": "success",
    "message": "Evaluation '5c8c0ead444bfa0dfa450068' successfully created."
}
```

----
### Students

**getStudents**

`GET /students` <br>
**method:** `GET` <br>
**route:** `/students` <br>
**params:** `-`

**Request**
```
curl -X GET \
  http://localhost:8000/api/students
```

**Response**

```
{
    "data": [
        {
            "_id": "5c8be6ec89a91670892d7317",
            "firstName": "Kris",
            "lastName": "Breitenberg",
            "billingAddress": {
                "_id": "5c8c121a444bfa0dfa450069",
                "street1": "01285 Glover Spur",
                "city": "Fritschville",
                "state": "Delaware",
                "zipCode": "34216",
                "country": "Somalia"
            },
            "creditCards": []
        },
        {
            "_id": "5c8be6ec89a91670892d7318",
            "firstName": "Westley",
            "lastName": "Mann",
            "billingAddress": {
                "_id": "5c8c121a444bfa0dfa45006a",
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
        }
      ],
      "status": "success",
      "message": "Found '2' Students."
}
```

----
**getStudent**

`GET /students/:id` <br>
**method:** `GET` <br>
**route:** `/students/:id` <br>
**params:** `-`

**Request**
```
curl -X GET \
  http://localhost:8000/api/students/5c8be6ec89a91670892d733b
```

**Response**
```
{
    "data": {
        "_id": "5c8be6ec89a91670892d733b",
        "firstName": "Sid",
        "lastName": "Bahringer",
        "billingAddress": {
            "_id": "5c8c12de444bfa0dfa45009b",
            "street1": "74214 Harley Dale",
            "city": "Idafort",
            "state": "Florida",
            "zipCode": "28354",
            "country": "Bahamas"
        },
        "creditCards": [
            {
                "firstName": "Nolan",
                "lastName": "Larson",
                "last4Numbers": 9813,
                "creditCardAPIToken": "2501c21a-dc62-4b60-b515-2a302ee9f672",
                "isDefault": true
            },
            {
                "firstName": "Lauren",
                "lastName": "Gorczany",
                "last4Numbers": 3825,
                "creditCardAPIToken": "0c702237-e32f-44ee-b69b-7115801dfbba",
                "isDefault": false
            }
        ]
    },
    "status": "success",
    "message": "Student '5c8be6ec89a91670892d733b' found."
}
```
----
**createStudent**

`POST /students/:id` <br>
**method:** `GET` <br>
**route:** `/students/:id` <br>
**params:** `-`

**Request**
```
curl -X POST \
  http://localhost:8000/api/students \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 5e2df4f0-50cf-447b-bfe6-6635110d6b7e' \
  -d '{
	"firstName": "Pupa",
	"lastName": "Polainas",
	"billingAddress": {
		"street1": "Av. De Mayo 776",
		"city": "Buenos Aires",
		"state": "Buenos Aires",
		"zipCode": "1084",
		"country": "Argentina"
	},
	"creditCards": [{
		"firstName": "Pupa",
		"lastName": "Polainas",
		"last4Numbers": 1234,
		"creditCardAPIToken": "030340543jbdjbjdbas3jnew",
		"isDefault": true
	}]
}'
```

**Response**
```
{
    "data": {
        "_id": "5c8bf2419984df0c32c5e009",
        "firstName": "Pupa",
        "lastName": "Polainas",
        "billingAddress": {
            "_id": "5c8bf2419984df0c32c5e00a",
            "street1": "Av. De Mayo 776",
            "city": "Buenos Aires",
            "state": "Buenos Aires",
            "zipCode": "1084",
            "country": "Argentina"
        },
        "creditCards": [
            {
                "_id": "5c8bf2419984df0c32c5e00b",
                "firstName": "Pupa",
                "lastName": "Polainas",
                "last4Numbers": 1234,
                "creditCardAPIToken": "030340543jbdjbjdbas3jnew",
                "isDefault": true
            }
        ],
        "__v": 0
    },
    "status": "success",
    "message": "Student '5c8bf2419984df0c32c5e009' successfully created."
}
```
