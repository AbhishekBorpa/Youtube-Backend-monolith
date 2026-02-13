import { Router } from "express";
import { getSystemStats } from "../controllers/admin.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyJWT);

// TODO: Add admin role check middleware
router.route("/stats").get(getSystemStats);

export default router;
