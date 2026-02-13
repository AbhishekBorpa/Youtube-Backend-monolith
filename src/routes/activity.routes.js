"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var activity_controller_1 = require("../controllers/activity.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT);
router.route("/").get(activity_controller_1.getUserActivities);
exports.default = router;
