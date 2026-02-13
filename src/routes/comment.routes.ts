import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
    getCommentReplies,
    toggleCommentHeart,
    pinComment
} from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyJWT);

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);
router.route("/replies/:commentId").get(getCommentReplies);
router.route("/heart/:commentId").patch(toggleCommentHeart);
router.route("/pin/:commentId").patch(pinComment);

export default router;
