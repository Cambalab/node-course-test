const GenericController = require("./genericController");

module.exports = (mongoose) => {
  const listOptions = {
    filterBy: [],
    sortBy: []
  };
  return GenericController(mongoose, "Technology", listOptions);
};
