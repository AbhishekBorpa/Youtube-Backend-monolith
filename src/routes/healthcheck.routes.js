"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var healthcheck_controller_1 = require("../controllers/healthcheck.controller");
var router = (0, express_1.Router)();
router.route("/").get(healthcheck_controller_1.healthcheck);
exports.default = router;
