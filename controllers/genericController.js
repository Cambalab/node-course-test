/**
 * GenericController - description
 *
 * @param  {mongoose} mongoose
 * @param  {String} modelName the mongoose model name
 * @param  {Object} listOptions filter and sort options for the list method
 *  ex: listOptions = { filterBy: ["status"], sortBy: ["date.from"] }
 * @return {GenericController} controller
 */
module.exports = function GenericController(mongoose, modelName, listOptions) {
  const Model = mongoose.model(modelName);

  function buildFilterQuery(params) {
    return listOptions.filterBy.reduce((_query, prop) => {
      const query = _query;
      if (params[prop]) {
        query[prop] = params[prop];
      }
      return query;
    }, {});
  }

  function buildSortQuery(sortBy = "") {
    const [sortField, sortDir] = sortBy.split(",");

    if (listOptions.sortBy.indexOf(sortField) > -1) {
      return {[sortField]: sortDir.toLowerCase() === "desc" ? -1 : 1};
    }
    return {};
  }

  function list(req, res) {
    Model.find(buildFilterQuery(req.query)).sort(buildSortQuery(req.query.sort))
      .then((models) => {
        res.response200(models, `Found '${models.length}' ${modelName}s.`);
      })
      .catch((err) => {
        res.response500(err, `${modelName}s couldn't be found!`);
      });
  }

  function create(req, res, normalizer) {
    const modelDTO = (normalizer && normalizer.normalize) ? normalizer.normalize(req.body) : req.body;
    Model.create(modelDTO)
      .then((model) => {
        res.response200(model, `${modelName} '${model._id}' successfully created.`);
      })
      .catch((err) => {
        res.response500(err, `${modelName} couldn't be created!`);
      });
  }

  function read(req, res) {
    Model.findById(req.params.id)
      .then((model) => {
        if (model) {
          res.response200(model, `${modelName} '${model._id}' found.`);
        } else {
          res.response404(`${modelName} not found!`);
        }
      })
      .catch((err) => {
        res.response500(err, `${modelName}s couldn't be found!`);
      });
  }

  function update(req, res) {
    Model.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
      .then((model) => {
        if (model) {
          res.response200(model, `${modelName} '${model._id}' successfully updated.`);
        } else {
          res.response404(`${modelName} not found!`);
        }
      })
      .catch((err) => {
        res.response500(err, `${modelName} couldn't be updated!`);
      });
  }

  function remove(req, res) {
    Model.deleteOne({_id: req.params.id})
      .then((rs) => {
        if (rs && rs.ok === 1 && rs.n === 1) {
          res.response200({rs}, `${modelName} successfully removed.`);
        } else {
          res.response404(`${modelName} not found!`);
        }
      })
      .catch((err) => {
        res.response500(err, `${modelName} couldn't be removed!`);
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
