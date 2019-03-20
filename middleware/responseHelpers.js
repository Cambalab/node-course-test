module.exports = (req, res, next) => {
  res.response200 = (data = {}, message = "ok") => {
    res.json({data, status: "success", message});
  };

  res.response404 = (message = "Not found!") => {
    res.status(404).json({status: "error", message});
  };

  res.response500 = (err, msg = "Unknown error!") => {
    const error = typeof err === "string" ? {message: err} : (err || {});
    if (msg && error.message) {
      error.message = `${msg} :: ${error.message}`;
    } else if (msg) {
      error.message = msg;
    }

    console.error(error);
    res.status(500).json({status: "error", message: error.message});
  };

  next();
};
