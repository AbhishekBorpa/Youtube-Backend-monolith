"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var report_controller_1 = require("../controllers/report.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT);
router.route("/").post(report_controller_1.createReport);
router.route("/reasons").get(report_controller_1.getReportReasons);
router.route("/:reportId/status").patch(report_controller_1.updateReportStatus); // Admin only ideally
exports.default = router;
