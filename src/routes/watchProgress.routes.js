"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var watchProgress_controller_1 = require("../controllers/watchProgress.controller");
var router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/").get(watchProgress_controller_1.getUserWatchHistory);
router.route("/:videoId")
    .get(watchProgress_controller_1.getWatchProgress)
    .post(watchProgress_controller_1.updateWatchProgress);
exports.default = router;
