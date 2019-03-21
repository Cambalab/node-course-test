module.exports = (globalCache,config) => {
    const responseHelpers = require("./responseHelpers");
    const cacheMiddleware = require("./cacheMiddleware")(globalCache,config);

    return {
        responseHelpers,
        cacheMiddleware
    }
};
