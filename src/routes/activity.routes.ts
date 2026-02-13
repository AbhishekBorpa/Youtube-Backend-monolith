import { Router } from "express";
import { getUserActivities } from "../controllers/activity.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getUserActivities);

export default router;
