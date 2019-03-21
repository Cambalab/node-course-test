module.exports = (req, res, next) => {
  const urlSinCache = ["/api/admin/billing/getChargeableStudents", "/api/admin/billing/getInvoices", "/api/afip"];
  console.log("Path", req.originalUrl, "method", req.method);
  console.log("global.cache", global.cache);
  if (urlSinCache.includes(req.originalUrl)) {
    console.log("URL no cacheada");
    
    return next();
  }
  // Reescribimos el metodo para que guarde la data en global
  res.response200 = (data = {}, message = "ok") => {
    global.cache[req.originalUrl] = data;
    res.json({data, status: "success", message});
  };

  if (req.method === "GET") { // Preguntamos si viene por GET
    console.log("GET");
    console.log(`Chequeamos si global.cache[${req.originalUrl}] tiene algo:`, global.cache[req.originalUrl]);
    
    if ((global.cache[req.originalUrl] !== undefined) && (global.cache[req.originalUrl] !== null)) { // Verificamos si tenemos esa data
      console.log("Esta cacheado");
      
      res.json({ data: global.cache[req.originalUrl], status: "success", message: "ok"}); // Si está, se la mandamos
      console.log("Mandamos la info cacheada");
      
    } else { // Si no tenemos nada, lo dejamos pasar
      console.log("No esta cacheado");
      
      return next();
    }
  } else if (req.method === "POST" || req.method === "PUT") {
    console.log("POST or PUT");
    console.log(`Chequeamos si global.cache[${req.originalUrl}] tiene algo:`, global.cache[req.originalUrl]);
    
    if ((global.cache[req.originalUrl] !== undefined) && (global.cache[req.originalUrl] !== null))  { // Verificamos si tenemos esa data
      console.log(`Borramos la info de global.cache[${req.originalUrl}] `);
      
      global.cache[req.originalUrl] = null; // Si está, la borramos
      return next();
    } else {
      return next();
    }
  }

  
};
