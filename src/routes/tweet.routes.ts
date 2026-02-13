import { Router } from "express";
import {
    createTweet, deleteTweet,
    getUserTweets,
    updateTweet,
    voteOnTweetPoll
} from "../controllers/tweet.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();
router.use(verifyJWT);

router.route("/").post(upload.single("image"), createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
router.route("/vote/:tweetId/:optionIndex").patch(voteOnTweetPoll);

export default router;
