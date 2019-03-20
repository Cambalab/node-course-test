let lastId = 1000;
const assert = require("assert");

function validateInvoice(invoice) {
  assert(typeof invoice.nomYAp === "string", "nomYAp must be a String");
  assert(typeof invoice.dir === "string", "dir must be a String");
  assert(typeof invoice.importe === "number", "importe must be a Number");
}

module.exports = {
  getInvoice(req, res) {
    try {
      validateInvoice(req.body);
      if (Math.random() >= 0.75) {
        res.response404();
      } else {
        res.response200({id: lastId});
        lastId++;
      }
    } catch (e) {
      res.status(400).json({status: "error", message: e.message});
    }
  }
};
