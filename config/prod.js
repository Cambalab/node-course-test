module.exports = {
  env: "prod",
  db: "mongodb://localhost:27017/courses",
  port: process.env.PORT || 80,
  ignoreCacheRoutes: [
    "/api/admin/billing/getChargeableStudents"
  ]
};
