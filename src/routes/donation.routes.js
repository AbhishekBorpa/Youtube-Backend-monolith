"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var donation_controller_1 = require("../controllers/donation.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT);
router.route("/").post(donation_controller_1.createDonation).get(donation_controller_1.getUserDonations);
exports.default = router;
