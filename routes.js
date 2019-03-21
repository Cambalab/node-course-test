const {
  BillingController,
  EvaluationsController,
  CoursesController,
  StudentsController,
  TechnologiesController,
  StatsController
} = require("./controllers");
const afipAPI = require("./services/afip-mock-api");

function mapGenericControllerRoutes(controllers, router) {
  controllers.forEach(({basePath, controller}) => {
    router.route(basePath)
      .get(controller.list)
      .post(controller.create);

    router.route(`${basePath}/:id`)
      .get(controller.read)
      .put(controller.update)
      .delete(controller.remove);
  });
}

module.exports = (app, router) => {
  const mongoose = app.get("mongoose");
  const courseController = CoursesController(mongoose);
  const studentController = StudentsController(mongoose);
  const evaluationController = EvaluationsController(mongoose);
  const technologyController = TechnologiesController(mongoose);
  const billingController = BillingController(mongoose, app);
  const statsController = StatsController(mongoose);

  const controllers = [
    {basePath: "/evaluations", controller: evaluationController},
    {basePath: "/courses", controller: courseController},
    {basePath: "/students", controller: studentController},
    {basePath: "/technologies", controller: technologyController}
  ];

  mapGenericControllerRoutes(controllers, router);

  router.route("/admin/billing/getChargeableStudents")
    .get(billingController.getChargeableStudents);

  router.route("/admin/billing/getInvoices")
    .get(billingController.getInvoices);

  router.route("/stats/failuresByStates")
    .get(statsController.failuresByStates);

  router.route("/afip")
    .post(afipAPI.getInvoice);

  return router;
};
