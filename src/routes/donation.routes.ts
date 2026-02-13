import { Router } from "express";
import { createDonation, getUserDonations } from "../controllers/donation.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createDonation).get(getUserDonations);

export default router;
