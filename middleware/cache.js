var cache = {};

const 
  newCache = () => {

    return {
      clear: () => {
        cache = {};
      },
      clearValue: (key) => {
        const newCache = {};
        cache = Object.keys(cache).filter(k => k != key).reduce((r,k) => {r[k] = cache[k]; return r;}, newCache);
      },
      add: (key, value) => {
        cache[key] = value
      },
      get: (key) => {
        return cache[key];
      },
      belongs: (key) => {
        return Object.keys(cache).includes(key);
      },
      list: () => {
        return Object.keys(cache);
      }
    }
  },

  notCachedUrls = [
    "/api/admin/billing/getChargeableStudents"
  ]

  middleware = (app) => (req, res, next) => {
    const cacheImpl = app.get("cache");

    res.response200 = (data = {}, message = "ok") => {
      if(!notCachedUrls.includes(req.originalUrl)){
        if(req.method === "GET"){
          cacheImpl.add(req.originalUrl, data[Object.keys(data)[0]]);
        }
        if(req.method === "POST" || req.method === "PUT"){
          cacheImpl.clearValue(req.originalUrl);
        }
      }     
      
      res.json({data, status: "success", message});
    };

    next();
  };

module.exports = {
  new: newCache,
  middleware,
}
