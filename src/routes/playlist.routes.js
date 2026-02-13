"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var playlist_controller_1 = require("../controllers/playlist.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/").post(playlist_controller_1.createPlaylist);
router.route("/:playlistId")
    .get(playlist_controller_1.getPlaylistById)
    .patch(playlist_controller_1.updatePlaylist)
    .delete(playlist_controller_1.deletePlaylist);
router.route("/add/:videoId/:playlistId").patch(playlist_controller_1.addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(playlist_controller_1.removeVideoFromPlaylist);
router.route("/user/:userId").get(playlist_controller_1.getUserPlaylists);
router.route("/watch-later").get(playlist_controller_1.getWatchLater);
router.route("/watch-later/:videoId").patch(playlist_controller_1.toggleWatchLater);
exports.default = router;
