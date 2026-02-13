import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import { SearchHistory } from "../models/searchHistory.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import mongoose from "mongoose";

const searchVideos = asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10, sortBy = "views", sortType = "desc" } = req.query;

    if (!q) {
        return res.status(200).json(new ApiResponse(200, { videos: [] }, "Query provided is empty"));
    }

    // Fuzzy search using regex for title and description
    const searchRegex = new RegExp(q as string, "i");

    const videos = await Video.find({
        $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { tags: { $in: [searchRegex] } }
        ],
        isPublished: true
    })
        .sort({ [sortBy as string]: sortType === "asc" ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    if (req.user?._id) {
        // Save search to history if user is logged in
        await SearchHistory.create({
            // @ts-ignore
            user: req.user._id,
            query: q as string
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
