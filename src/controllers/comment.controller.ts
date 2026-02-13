import mongoose from "mongoose"
import { Comment } from "../models/comment.model"
import { Video } from "../models/video.model"
import { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { Request, Response } from "express"

const getVideoComments = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId as string),
                parentComment: null // Fetch only top-level comments
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: (Number(page) - 1) * Number(limit)
        },
        {
            $limit: Number(limit)
        }
    ])

    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"))
})

const addComment = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params
    const { content, parentId } = req.body

    if (!content) throw new ApiError(400, "Content is required")

    const comment = await Comment.create({
        content,
        video: videoId,
        // @ts-ignore
        owner: req.user?._id,
        parentComment: parentId || null
    })

    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))
})

const getCommentReplies = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params
    const { page = 1, limit = 10 } = req.query

    const replies = await Comment.aggregate([
        {
            $match: {
                parentComment: new mongoose.Types.ObjectId(commentId as string)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        },
        {
            $sort: { createdAt: 1 }
        },
        {
            $skip: (Number(page) - 1) * Number(limit)
        },
        {
            $limit: Number(limit)
        }
    ])

    return res.status(200).json(new ApiResponse(200, replies, "Replies fetched successfully"))
})

const updateComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!content) throw new ApiError(400, "Content is required")

    const comment = await Comment.findById(commentId)

    if (!comment) throw new ApiError(404, "Comment not found")

    // @ts-ignore
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)
    // @ts-ignore
    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

const toggleCommentHeart = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId as any)) throw new ApiError(400, "Invalid comment ID");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    const video = await Video.findById(comment.video);
    if (!video) throw new ApiError(404, "Video not found");

    // Check if requester is the owner of the VIDEO (not the comment)
    // @ts-ignore
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only the video owner can heart comments");
    }

    comment.ownerHearted = !comment.ownerHearted;
    await comment.save();

    return res.status(200).json(new ApiResponse(200, comment, "Comment heart toggled"));
});

const pinComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId as string)) throw new ApiError(400, "Invalid comment ID");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    const video = await Video.findById(comment.video);
    if (!video) throw new ApiError(404, "Video not found");

    // @ts-ignore
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only the video owner can pin comments");
    }

    // If already pinned, unpin it
    if (comment.isPinned) {
        comment.isPinned = false;
        await comment.save();
        video.pinnedComment = undefined;
        await video.save();
        return res.status(200).json(new ApiResponse(200, comment, "Comment unpinned"));
    }

    // Unpin currently pinned comment if exists
    if (video.pinnedComment) {
        await Comment.findByIdAndUpdate(video.pinnedComment, { isPinned: false });
    }

    comment.isPinned = true;
    await comment.save();

    video.pinnedComment = comment._id as mongoose.Types.ObjectId;
    await video.save();

    return res.status(200).json(new ApiResponse(200, comment, "Comment pinned successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    getCommentReplies,
    toggleCommentHeart,
    pinComment
}
