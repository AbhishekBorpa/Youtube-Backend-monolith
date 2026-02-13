import { Router } from "express";
import {
    createReport,
    updateReportStatus,
    getReportReasons
} from "../controllers/report.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createReport);
router.route("/reasons").get(getReportReasons);
router.route("/:reportId/status").patch(updateReportStatus); // Admin only ideally

export default router;
