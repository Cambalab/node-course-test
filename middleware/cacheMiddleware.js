const memCache = {};

function isInCache({url}) {
  return memCache[url];
}

function getNewUrl(oldUrl) {
  const splitted = oldUrl.split("/").slice(1, -1);
  return splitted.reduce((oldValue, newValur) => {
    return (`${oldValue}/${newValur}`);
  }, "");
}

module.exports = (req, res, next) => {
  const forbiddenPaths = ["/admin/billing/getChargeableStudents"];
  const dontAuth = forbiddenPaths.find((path) => {
    return path === `${req.method} ${req.url}`;
  });
  const isCached = isInCache(req);
  if (req.method === "GET" && !dontAuth) {
    if (isCached) {
      return res.response200((isCached), "Was cached!");
    }
    res.response200 = (data = {}, message = "ok") => {
      memCache[req.originalUrl] = data;
      res.json({data, status: "success", message});
    };
  } else if (req.method === "POST" && isCached) {
    Reflect.deleteProperty(memCache, req.url);
    return next();
  } else if (req.method === "PUT" && isCached) {
    Reflect.deleteProperty(memCache, getNewUrl(req.originalUrl));
    return next();
  }
  return next();
};
