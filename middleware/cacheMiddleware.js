const notStored = [
  "/api/admin/billing/getChargeableStudents"
];

function isNotCacheable(url){
  return notStored.find(item => {
    return url.includes(item);
  })
}

function findResponse(dictionary, url){
  return dictionary[url];
}

let postCondition = (key, url) => {
  return key == url
}

function getParentPath(url){
  let parts = url.split("/");
  return (parts.slice(0, parts.length -1)).join("/");
}

let putCondition = (key, url) => {
  let parentUrl = getParentPath(url);
  return key == url || key == parentUrl
}

function deleteFromDictionary(dictionary, method, url){
  let condition;
  if(method === 'POST') 
    condition = postCondition
  else //method PUT
    condition = putCondition
  for(key in dictionary){
    if(condition(key, url)){
      delete dictionary[key];
    }
  }
}

module.exports = (dictionary) => {
  return (req, res, next) => {
    if(isNotCacheable(req.originalUrl)){
      //console.log("Ruta no cacheable")
      next()
    } else if(req.method === "GET") {
        let elem = findResponse(dictionary, req.originalUrl);
        if(elem){
          //console.log("Respuesta cacheada")
          res.json(elem)
        } else {
          //console.log("Respuesta sin cachear")
          next()
        }
    } else if(req.method === "POST" || req.method === "PUT") {
        deleteFromDictionary(dictionary, req.method, req.originalUrl)
        next()
    }
  }
};