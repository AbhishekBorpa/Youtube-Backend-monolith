"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var subscription_controller_1 = require("../controllers/subscription.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT);
router
    .route("/c/:channelId")
    .get(subscription_controller_1.getUserChannelSubscribers)
    .post(subscription_controller_1.toggleSubscription);
router.route("/u/:subscriberId").get(subscription_controller_1.getSubscribedChannels);
router.route("/notification/:channelId").patch(subscription_controller_1.toggleSubscriptionNotification);
exports.default = router;
