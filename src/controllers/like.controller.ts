import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { Request, Response } from "express"
import { logActivity } from "../utils/activityTracker"

const toggleVideoLike = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId as any)) throw new ApiError(400, "Invalid videoId")

    const existingLike = await Like.findOne({
        video: videoId,
        // @ts-ignore
        likedBy: req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Unliked video"))
    }

    await Like.create({
        video: videoId,
        // @ts-ignore
        likedBy: req.user?._id
    })

    // @ts-ignore
    await logActivity(req.user._id, "LIKE_VIDEO", videoId, "Video");

    return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Liked video"))
})

const toggleCommentLike = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params
    if (!isValidObjectId(commentId as any)) throw new ApiError(400, "Invalid commentId")

    const existingLike = await Like.findOne({
        comment: commentId,
        // @ts-ignore
        likedBy: req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Unliked comment"))
    }

    await Like.create({
        comment: commentId,
        // @ts-ignore
        likedBy: req.user?._id
    })

    // @ts-ignore
    await logActivity(req.user._id, "LIKE_COMMENT", commentId, "Comment");

    return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Liked comment"))
})

const toggleTweetLike = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId as any)) throw new ApiError(400, "Invalid tweetId")

    const existingLike = await Like.findOne({
        tweet: tweetId,
        // @ts-ignore
        likedBy: req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Unliked tweet"))
    }

    await Like.create({
        tweet: tweetId,
        // @ts-ignore
        likedBy: req.user?._id
    })

    // @ts-ignore
    await logActivity(req.user._id, "LIKE_TWEET", tweetId, "Tweet");

    return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Liked tweet"))
})

const getLikedVideos = asyncHandler(async (req: Request, res: Response) => {
    const likedVideosAggregate = await Like.aggregate([
        {
            $match: {
                // @ts-ignore
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        },
        { $match: { video: { $exists: true } } },
        {
            $project: {
                video: 1,
            }
        }
    ])

    const likedVideos = likedVideosAggregate.map(item => item.video)

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}
