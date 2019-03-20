# Dominio

Tenemos una empresa que se dedica a hacer cursos y evaluaciones técnicas a desarrolladores.
Para simplificar nuestras tareas administrativas necesitamos hacer un sitio web que administre:

- ABM de Cursos
- ABM de Clases
- ABM de Evaluaciones
- ABM de Tecnologías
- ABM de alumnos (devs)
- ABM de usuarios (opcional)

**ABM: Sistema de alta, baja y modificación**

Preguntas:

Cambiarías algo de como estuvo modelada la aplicacion?
Que más le agregarías?


# Modelos

### Technology

```js
{
  name: {type: String, required: true}, // The human readable name
  technologyId: {type: String, required: true, unique: true}, // slug-case name. Used as identifier by other models
}

```

### Student

```js
{
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  billingAddress: {type: Address},
  creditCards: [CreditCard]
}

```

### CreditCard

```js
{
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  last4Numbers: {type: Number, required: true}
  creditCardAPIToken: {type: String, required: true},
  isDefault: {type: Boolean, required: true},
}

```

### Address

```js
{
  street1: {type: String, required: true},
  street2: {type: String, required: false},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zipCode: {type: String, required: true},
  country: {type: String, required: true}
}

```

### Evaluation

```js
{
  courseId: {type: String, required: true},
  date: {
    from: {type: Date, required: true},
    to: {type: Date, required: true}
  },
  abstract: {type: String, required: true},
  notes: [EvaluationStudent] // the ids of the students
}
```

### EvaluationStudent

```js
{
  studentId: {type: String, required: true},
  qualification: {type: Number, required: true},
  status: {
    type: String,
    enum: ["passed", "failed"],
    required: true
  }
}
```

### Course

```js
{
  technologyId: {type: String, required: true},
  date: {
    from: {type: Date, required: true},
    to: {type: Date, required: true}
  },
  description: {type: String, required: true},
  status: {
    type: String,
    enum: ["new", "registration open", "ongoing", "finished"],
    default: "new"
  },
  classes: [CourseClass]
  students: [String], // the ids of the students
  price: {type: Number, required: true}
}
```

### CourseClass

```js
{
  name: {type: String, required: true},
  description: {type: String, required: true},
  content: {type: String, required: true},
  tags: {type: [String], required: false}
}
```
