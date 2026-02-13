"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var video_controller_1 = require("../controllers/video.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var multer_middleware_1 = require("../middlewares/multer.middleware");
var router = (0, express_1.Router)();
router.route("/")
    .get(video_controller_1.getAllVideos)
    .post(auth_middleware_1.verifyJWT, multer_middleware_1.upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
]), video_controller_1.publishAVideo);
router
    .route("/:videoId")
    .get(video_controller_1.getVideoById)
    .delete(auth_middleware_1.verifyJWT, video_controller_1.deleteVideo)
    .patch(auth_middleware_1.verifyJWT, multer_middleware_1.upload.single("thumbnail"), video_controller_1.updateVideo);
router.route("/toggle/publish/:videoId").patch(auth_middleware_1.verifyJWT, video_controller_1.togglePublishStatus);
router.route("/view/:videoId").patch(video_controller_1.incrementViewCount);
router.route("/related/:videoId").get(video_controller_1.getRelatedVideos);
router.route("/pin/:videoId/:commentId").patch(auth_middleware_1.verifyJWT, video_controller_1.togglePinComment);
exports.default = router;
