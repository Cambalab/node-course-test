module.exports = (mongoose) => {
  var Course = mongoose.model("Course"),
  filterFields = ["status", "technologyId"],
  sortFields = ["status"];

  var buildFilterQuery = function(params) {
    return filterFields.reduce((query, prop) => {
      if (params[prop]) {
        query[prop] = params[prop];
      }
      return query;
    }, {});
  }

  function getCourseDTO(course) {
    course.date.from = new Date(course.date.from);
    course.date.to = new Date(course.date.to);
    return course;
  }

  function list(req, res) {
    Course
      .find(buildFilterQuery(req.query))
      .sort()
      .then(function (courses) {
        res.response200({courses}, "Found '" + courses.length + "' Courses.");
      })
      .catch(function (err) {
        res.response500(err, "Courses couldn't be found!");
      });
  }

  function create(req, res) {
    let courseDTO = getCourseDTO(req.body);
    Course.create(courseDTO)
      .then((course) => {
        res.response200(course, `Course '${course._id}' successfully created.`);
      })
      .catch((err) => {
        res.response500(err,  "Course couldn't be created!");
      });
  }

  function read(req, res) {
    Course.findById({ _id: req.params.id })
      .then((course) => {
        if (course) {
            res.response200({course}, `Course '${course._id}' found.`);
        } else {
            res.response404("Course not found!");
        }
      })
      .catch((err) => {
        res.response500(err, "Course couldn't be found!");
      });
  }

  function update(req, res) {
    Course.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
      .then((course) => {
        if (course) {
          res.response200({course}, `Course '${course._id}' successfully updated.`);
        } else {
          res.response404('Course not found!');
        }
      })
      .catch((err) => {
        res.response500(err, "Course couldn't be updated!");
      });
  }

  function remove(req, res) {
    Course.deleteOne({_id: req.params.id})
      .then((rs) => {
        if (rs && rs.ok === 1 && rs.n === 1) {
          res.response200({rs}, "Course successfully removed.");
        } else {
          res.response404("Course not found!");
        }
      })
      .catch((err) => {
        res.response500(err, "Course couldn't be removed!");
      });
  }

  return {
    list,
    create,
    read,
    update,
    remove
  };
};
