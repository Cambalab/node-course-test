const excludedFromCache = [
  "/api/admin/billing/getChargeableStudents"
];
const cache = {};

function isCached(req) {
  return cache[req.url];
}
function getFromCache(req) {
  return cache[req.url];
}

function removeFromCache(req) {
  delete cache[req.url];
}
module.exports = (req, res, next) => {
  if (excludedFromCache.includes(req.originalUrl)) {
    return next();
  }
  if (req.method === "GET") {
    if (isCached(req)) {
      return res.response200(getFromCache(req), "Cached");
    }
    res.response200 = (data = {}, message = "ok") => {
      cache[req.originalUrl] = data;
      res.json({data, status: "success", message});
    };
  } else {
    removeFromCache(req);
  }
  return next();
};
