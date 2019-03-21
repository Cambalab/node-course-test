const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("./config");
const {responseHelpers, cache} = require("./middleware");
const routes = require("./routes");
require("./models");

const app = express();

// Keep the config and mongoose inside app so it could be accessed inside it, anywhere
app.set("config", config);
app.set("mongoose", mongoose);

// Give our app support to parse JSON data on form POST requests and make it available at req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan("dev"));

// Add response helpers
app.use(responseHelpers);

//Add cache capacity
app.set("cache", cache.new());
app.use(cache.middleware(app));

// Add cache middleware
// app.use(cacheMiddleware);

// Setup mongoose and load models
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {useNewUrlParser: true});
// models(mongoose);

// Register the routes and mount them all at /api
app.use("/api", routes(app, express.Router()));

// default route handler
app.use((req, res) => {
  res.status(404).send(`${req.originalUrl} not found`);
});


app.listen(config.port, () => {
  console.log(`courses-evaluation-api listening on port ${config.port}!`);
});

module.exports = app;
