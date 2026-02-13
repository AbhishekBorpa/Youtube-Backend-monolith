import { Activity } from "../models/activity.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const getUserActivities = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?._id;
    const { page = 1, limit = 20 } = req.query;

    const activities = await Activity.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    const total = await Activity.countDocuments({ user: userId });

    return res.status(200).json(new ApiResponse(200, { activities, total }, "Activities fetched"));
});

export {
    getUserActivities
}
