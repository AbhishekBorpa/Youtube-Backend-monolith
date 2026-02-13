import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    getWatchProgress,
    getUserWatchHistory,
    updateWatchProgress
} from "../controllers/watchProgress.controller";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getUserWatchHistory);
router.route("/:videoId")
    .get(getWatchProgress)
    .post(updateWatchProgress);

export default router;
