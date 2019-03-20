const env = process.env.NODE_ENV || "dev";
// eslint-disable-next-line
const config = require(`./${env}`);

module.exports = config;
