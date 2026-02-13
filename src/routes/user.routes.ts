import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    changeCurrentPassword,
    refreshAccessToken,
    blockUser,
    clearWatchHistory,
    getBlockedUsers,
    removeFromWatchHistory,
    unblockUser,
    updateUserPreferences,
    getUserPreferences,
    getUserSessions,
    revokeSession
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/preferences").get(verifyJWT, getUserPreferences).patch(verifyJWT, updateUserPreferences);
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/history/clear").delete(verifyJWT, clearWatchHistory);
router.route("/history/:videoId").delete(verifyJWT, removeFromWatchHistory);

router.route("/block/:userId").patch(verifyJWT, blockUser);
router.route("/unblock/:userId").patch(verifyJWT, unblockUser);
router.route("/blocked").get(verifyJWT, getBlockedUsers);

router.route("/sessions").get(verifyJWT, getUserSessions);
router.route("/sessions/:sessionId").delete(verifyJWT, revokeSession);

export default router;
