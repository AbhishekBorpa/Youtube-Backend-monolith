import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { Comment } from "../models/comment.model";
import { Like } from "../models/like.model";
import { Tweet } from "../models/tweet.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const getSystemStats = asyncHandler(async (req: Request, res: Response) => {
    // Ideally this should be cached or aggregated periodically
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalTweets = await Tweet.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Like.countDocuments();

    // Aggregating total views across all videos
    const totalViewsResult = await Video.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ]);
    const totalViews = totalViewsResult[0]?.totalViews || 0;

    const stats = {
        totalUsers,
        totalVideos,
        totalTweets,
        totalComments,
        totalLikes,
        totalViews
    };

    return res.status(200).json(new ApiResponse(200, stats, "System stats fetched successfully"));
});

export {
    getSystemStats
}
