module.exports = (mongoose) => {
  const Course = mongoose.model("Course");
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");
  const request = require("request");

  const pathStudents = "http://localhost:8000/api/admin/billing/getChargeableStudents";
  // para cada curso dame la evaluacion
  // para cada evaluacion dame los aprobados
  // para cada aprobado dame el precio del curso y el student
  // Nombre, apellido, y direccion de facturacion
  // agrupar por student y calcular precio final
  // devolver precio, nombre, apellido y billing address

  /**
   * getInvoices - get the students invoice from a list of ChargeableStudents
   */


  console.log("Empiezo Get");

  function postAfipInvoice(afipQuery) {
    return new Promise((resolve, reject) => {
      request.post("http://localhost:8000/api/afip", {json: afipQuery}, (_, resp, body) => {
        console.log("POST: ", body);
        if (body.status === "success") resolve(body.data);
        if (resp.statusCode === 404) {
          console.log(`Afip send ${resp.statusCode} Status Code. Retrying `);
          resolve(postAfipInvoice(afipQuery));
        } else if (resp.statusCode > 400) {
          console.log("No managed ERROR, please inform it to de developer ", resp.statusCode);
        }
      });
    });
  }


  function ShowResult(result) {
    return new Promise((resolve) => {
      resolve(result);
    });
  }
  function getJSON(url) {
    return new Promise((resolve) => {
      const options = {
        url,
        headers: {
          "user-agent": "node-course"
        }
      };

      request.get(options, (err, response, body) => {
        if (err) {
          console.log("Error en get");
        }
        if (response.statusCode === 200) {
          // console.log("Body " +body);
          console.log(`Body JJ ${JSON.parse(body)}`);
          resolve(JSON.parse(body));
        }
      });
    });
  }


  const afipInvoices = [];

  function postEachAfipInvoice(studentList) {
    return new Promise((resolve) => {
      console.log(`Begin eachInvoice with list ${JSON.stringify(studentList)}`);
      studentList.data.studentsBillingInfo.forEach(async (billingInfo) => {
        // console.log(`Domicilio ${JSON.stringify(billingInfo.address)}`);
        const afipQuery = {
          "nomYAp": `${billingInfo.firstName} ${billingInfo.lastName}`,
          "dir": `${billingInfo.address.street1} ${billingInfo.address.city}`,
          "importe": billingInfo.price / 100
        };

        const factura = await postAfipInvoice(afipQuery);
        afipInvoices.push(factura);
        console.log(`Query ${JSON.stringify(factura)}`);
      });
      resolve(afipInvoices);
    });
  }

  async function getInvoices(req, res) {
    console.log("Run waiting to make sync ");
    const studentList = await getJSON(pathStudents);
    console.log("Paso2 ");
    const invoicesList = await postEachAfipInvoice(studentList);
    console.log("Paso3 ");
    const resultInvoices = await ShowResult(invoicesList);
    console.log("***************FIN");
    console.log(`Fin: ${JSON.stringify(resultInvoices)}`);
    return res.response200({resultInvoices}, `Generated '${resultInvoices.length}' Invoices.`);
  }
  return {
    getInvoices
  };
};
