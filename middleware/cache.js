const cache = {};
const excludedRoutes = ["/api/admin/billing/getChargeableStudents"];

function isInCache(url) {
  return cache[url];
}

function addToCache(req, data) {
  cache[req.originalUrl] = data;
}

function eraseFromCache(url) {
  return delete cache[url];
}

function routeIsExcluded(route) {
  return excludedRoutes.includes(route);
}

function cutLast(string) {
  const splitted = string.split("/").slice(1, -1);
  return splitted.reduce((str, newStr) => {
    return `${str}/${newStr}`;
  }, "");
}

function cacheMiddlewareBefore(req, res, next) {
  if (routeIsExcluded(req.originalUrl)) {
    return next();
  }
  const value = isInCache(req.originalUrl);
  if (value) {
    if (req.method === "GET") {
      return res.response200(value, "Got data from cache");
    }
    if (req.method === "POST") {
      eraseFromCache(req.originalUrl);
    }
    if (req.method === "PUT") {
      eraseFromCache(req.originalUrl);
      eraseFromCache(cutLast(req.originalUrl));
    }
  } else if (req.method === "PUT" && isInCache(cutLast(req.originalUrl))) {
    eraseFromCache(cutLast(req.originalUrl));
  } else {
    res.response200 = (data = {}, message = "") => {
      addToCache(req, data);
      res.json({data, status: "success", message});
    };
  }
  return next();
}


module.exports = {
  cacheMiddlewareBefore
};
