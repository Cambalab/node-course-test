
module.exports = (dictionary) => {
  const responseHelpers = require("./responseHelpers")(dictionary);
  const cacheMiddleware = require("./cacheMiddleware")(dictionary);

  return {
    cacheMiddleware,
    responseHelpers
  }  
};
