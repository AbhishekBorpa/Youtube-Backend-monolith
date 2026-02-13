import { Router } from "express";
import {
    createCommunity,
    getCommunityDetails,
    joinCommunity,
    leaveCommunity,
    updateCommunity
} from "../controllers/community.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// All community routes require authentication
router.use(verifyJWT);

router.route("/").post(
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
    createCommunity
);

router.route("/:communityId")
    .get(getCommunityDetails)
    .patch(
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
        updateCommunity
    );

router.route("/join/:communityId").post(joinCommunity);
router.route("/leave/:communityId").post(leaveCommunity);

export default router;
