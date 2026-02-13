import { Router } from "express";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notification.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getUserNotifications);
router.route("/:notificationId/read").patch(markNotificationAsRead);

export default router;
