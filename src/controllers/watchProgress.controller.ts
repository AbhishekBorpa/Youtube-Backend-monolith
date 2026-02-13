import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { WatchProgress } from "../models/watchProgress.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const updateWatchProgress = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { positionSec, isCompleted } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (positionSec === undefined || positionSec < 0) {
        throw new ApiError(400, "Valid position (seconds) is required");
    }

    // @ts-ignore
    const userId = req.user?._id;

    const progress = await WatchProgress.findOneAndUpdate(
        { user: userId, video: videoId },
        {
            $set: {
                positionSec,
                isCompleted: isCompleted || false,
                lastWatched: new Date()
            }
        },
        { new: true, upsert: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, progress, "Watch progress updated"));
});

const getWatchProgress = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // @ts-ignore
    const userId = req.user?._id;

    const progress = await WatchProgress.findOne({ user: userId, video: videoId });

    if (!progress) {
        // Return 0 progress if not found, rather than 404, as it's useful for UI
        return res
            .status(200)
            .json(new ApiResponse(200, { positionSec: 0, isCompleted: false }, "No progress found, returned default"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, progress, "Watch progress fetched"));
});

const getUserWatchHistory = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    // We can use aggregate paginate if needed, but for now simple find is enough
    // We probably want to populate the video details
    const history = await WatchProgress.find({ user: userId })
        .sort({ lastWatched: -1 })
        .limit(parseInt(limit as string))
        .populate({
            path: "video",
            select: "title thumbnail duration owner views",
            populate: {
                path: "owner",
                select: "username avatar"
            }
        });

    return res
        .status(200)
        .json(new ApiResponse(200, history, "Watch history fetched"));
});

export {
    updateWatchProgress,
    getWatchProgress,
    getUserWatchHistory
};
