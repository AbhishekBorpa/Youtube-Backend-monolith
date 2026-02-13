import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import { SearchHistory } from "../models/searchHistory.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import mongoose from "mongoose";

const searchVideos = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q) {
        return res.status(200).json(new ApiResponse(200, { videos: [] }, "Query provided is empty"));
    }

    const videos = await Video.find({ $text: { $search: q as string } }).limit(10);
    // const tweets = await Tweet.find({ $text: { $search: q as string } }).limit(10); // Removed as per instruction

    // @ts-ignore
    // @ts-ignore
    if (req.user?._id) {
        // Save search to history if user is logged in
        await SearchHistory.create({
            // @ts-ignore
            user: req.user._id,
            query: q as string // Changed from 'query' to 'q'
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getSearchHistory = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const history = await SearchHistory.find({ user: req.user?._id })
        .sort({ createdAt: -1 })
        .limit(10);

    return res.status(200).json(new ApiResponse(200, history, "Search history fetched"));
});

const clearSearchHistory = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    await SearchHistory.deleteMany({ user: req.user?._id });

    return res.status(200).json(new ApiResponse(200, {}, "Search history cleared"));
});

export {
    searchVideos,
    getSearchHistory,
    clearSearchHistory
};
