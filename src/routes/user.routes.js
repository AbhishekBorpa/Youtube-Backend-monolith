"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var multer_middleware_1 = require("../middlewares/multer.middleware");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
router.route("/register").post(multer_middleware_1.upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), user_controller_1.registerUser);
router.route("/login").post(user_controller_1.loginUser);
// secured routes
router.route("/logout").post(auth_middleware_1.verifyJWT, user_controller_1.logoutUser);
router.route("/current-user").get(auth_middleware_1.verifyJWT, user_controller_1.getCurrentUser);
router.route("/update-account").patch(auth_middleware_1.verifyJWT, user_controller_1.updateAccountDetails);
router.route("/preferences").get(auth_middleware_1.verifyJWT, user_controller_1.getUserPreferences).patch(auth_middleware_1.verifyJWT, user_controller_1.updateUserPreferences);
router.route("/change-password").post(auth_middleware_1.verifyJWT, user_controller_1.changeCurrentPassword);
router.route("/refresh-token").post(user_controller_1.refreshAccessToken);
router.route("/avatar").patch(auth_middleware_1.verifyJWT, multer_middleware_1.upload.single("avatar"), user_controller_1.updateUserAvatar);
router.route("/cover-image").patch(auth_middleware_1.verifyJWT, multer_middleware_1.upload.single("coverImage"), user_controller_1.updateUserCoverImage);
router.route("/c/:username").get(auth_middleware_1.verifyJWT, user_controller_1.getUserChannelProfile);
router.route("/history").get(auth_middleware_1.verifyJWT, user_controller_1.getWatchHistory);
router.route("/history/clear").delete(auth_middleware_1.verifyJWT, user_controller_1.clearWatchHistory);
router.route("/history/:videoId").delete(auth_middleware_1.verifyJWT, user_controller_1.removeFromWatchHistory);
router.route("/block/:userId").patch(auth_middleware_1.verifyJWT, user_controller_1.blockUser);
router.route("/unblock/:userId").patch(auth_middleware_1.verifyJWT, user_controller_1.unblockUser);
router.route("/blocked").get(auth_middleware_1.verifyJWT, user_controller_1.getBlockedUsers);
router.route("/sessions").get(auth_middleware_1.verifyJWT, user_controller_1.getUserSessions);
router.route("/sessions/:sessionId").delete(auth_middleware_1.verifyJWT, user_controller_1.revokeSession);
exports.default = router;
