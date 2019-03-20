

module.exports = (globalCache,config)  => {
  
  return (req, res, next) => {

    //Check ignore cache routes config
    if (!config.ignoreCacheRoutes || config.ignoreCacheRoutes.indexOf(req.originalUrl) === -1) {

      if (req.method == "GET") {
        console.log('Looking for cache',globalCache)
        //Check if resource alredy requested
        if (globalCache[req.originalUrl]) 
          //Found! then return it
          return res.response200(globalCache[req.originalUrl]);
  
        //Overrides response200 to store data on success
        res.response200 = (data = {}, message = "ok") => {
          const json = {data, status: "success", message};
          globalCache[req.originalUrl] = json;
          res.json(json);
        };
      }
      console.log('req.method',req.method)
      if (req.method === "POST" || req.method === "PUT") {


        //Removes from cache this resource and all related requests
        Object.entries(globalCache).forEach(([key,value], idx) => {
          
          let drop = false;
          let url = req.url;

          //Removes entries in find
          if (req.method === "PUT") {
            //Get id by parsing string because req.params.id isnt available here!
            const urlSplit = url.split("/")
            if ( key === url )
              drop = true;
            
            //patch url variable 
            urlSplit.pop()
            url = urlSplit.join("/")
          }

          //Removes entries in list
          if ( !drop && key === url) 
            drop = true;
            
          //Removes entries in list with queries
          if ( key.includes(`${url}?`) )
            drop = true;

          if ( drop )
            delete globalCache[key] ;
        });

      }
    }
    else {
      console.log('Ignoring cache on route '+req.originalUrl)
    }

    next();
  }

};
