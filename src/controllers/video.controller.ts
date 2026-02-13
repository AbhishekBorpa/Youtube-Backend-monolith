import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Video } from "../models/video.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { logActivity } from "../utils/activityTracker";

const getAllVideos = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId, minDuration, maxDuration, uploadDate, category, type } = req.query

    const pipeline: any[] = [];

    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                    { tags: { $in: [new RegExp((query as string), "i")] } }
                ]
            }
        });
    }

    if (userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId as string)
            }
        });
    }

    if (minDuration || maxDuration) {
        const durationMatch: any = {};
        if (minDuration) durationMatch.$gte = parseInt(minDuration as string);
        if (maxDuration) durationMatch.$lte = parseInt(maxDuration as string);
        pipeline.push({ $match: { duration: durationMatch } });
    }

    if (uploadDate) {
        const date = new Date();
        if (uploadDate === 'today') date.setHours(0, 0, 0, 0);
        else if (uploadDate === 'week') date.setDate(date.getDate() - 7);
        else if (uploadDate === 'month') date.setMonth(date.getMonth() - 1);
        else if (uploadDate === 'year') date.setFullYear(date.getFullYear() - 1);

        pipeline.push({ $match: { createdAt: { $gte: date } } });
    }

    if (category) {
        pipeline.push({
            $match: { category: category as string }
        });
    }

    if (type) {
        pipeline.push({
            $match: { type: type as string } // 'video' or 'short'
        });
    }

    // Only show published videos if not owner or if specifically looking for published
    // Also check publishAt date if it exists
    pipeline.push({
        $match: {
            isPublished: true,
            $or: [
                { publishAt: { $exists: false } }, // No schedule date
                { publishAt: { $lte: new Date() } } // Schedule date passed
            ]
        }
    });

    pipeline.push({
        $sort: {
            [sortBy as string || "createdAt"]: sortType === "asc" ? 1 : -1
        }
    });

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
    };

    // @ts-ignore
    const videos = await Video.aggregatePaginate(videoAggregate, options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
})

const publishAVideo = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, tags, category, type, publishAt, chapters } = req.body

    if (
        [title, description, category, type].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const videoFileLocalPath = files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Video file upload failed")
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail upload failed")
    }

    // Parse tags if provided as string (e.g., comma-separated) or array
    let processedTags: string[] = [];
    if (tags) {
        if (Array.isArray(tags)) {
            processedTags = tags;
        } else if (typeof tags === 'string') {
            processedTags = tags.split(',').map(tag => tag.trim());
        }
    }

    const videoData: any = {
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        // @ts-ignore
        owner: req.user._id,
        isPublished: true,
        tags: processedTags,
        category: category || "General",
        type: type || "video"
    };

    if (publishAt) {
        videoData.publishAt = new Date(publishAt);
    }

    if (chapters) {
        // Expect chapters to be a JSON string if sent via multipart/form-data
        try {
            videoData.chapters = typeof chapters === 'string' ? JSON.parse(chapters) : chapters;
        } catch (e) {
            videoData.chapters = [];
        }
    }

    const video = await Video.create(videoData)

    const createdVideo = await Video.findById(video._id)

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while uploading the video")
    }

    // @ts-ignore
    await logActivity(req.user._id, "UPLOAD_VIDEO", video._id, "Video");

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId as string)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId).populate("owner", "username fullName avatar")

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params
    const { title, description, tags, publishAt, chapters } = req.body

    const thumbnailLocalPath = req.file?.path

    if (!isValidObjectId(videoId as string)) {
        throw new ApiError(400, "Invalid video ID")
    }

    if (!title && !description && !thumbnailLocalPath && !tags && !publishAt && !chapters) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // @ts-ignore
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (description) updateData.description = description

    if (tags) {
        if (Array.isArray(tags)) {
            updateData.tags = tags;
        } else if (typeof tags === 'string') {
            updateData.tags = tags.split(',').map(tag => tag.trim());
        }
    }

    if (publishAt) updateData.publishAt = new Date(publishAt);

    if (chapters) {
        try {
            updateData.chapters = typeof chapters === 'string' ? JSON.parse(chapters) : chapters;
        } catch (e) {
            // ignore
        }
    }

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if (!thumbnail.url) {
            throw new ApiError(400, "Error while uploading thumbnail")
        }
        updateData.thumbnail = thumbnail.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateData
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})

const incrementViewCount = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId as string)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: { views: 1 }
        },
        { new: true }
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "View count incremented successfully")
    )
})

const togglePinComment = asyncHandler(async (req: Request, res: Response) => {
    const { videoId, commentId } = req.params

    if (!isValidObjectId(videoId as string) || !isValidObjectId(commentId as string)) {
        throw new ApiError(400, "Invalid video or comment ID")
    }

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    // @ts-ignore
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to pin comments on this video")
    }

    // Toggle logic: if already pinned, unpin; otherwise pin
    if (video.pinnedComment?.toString() === commentId) {
        video.pinnedComment = undefined
    } else {
        // @ts-ignore
        video.pinnedComment = commentId
    }

    await video.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, video, "Comment pin status toggled successfully")
    )
})

const getRelatedVideos = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId as string)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const currentVideo = await Video.findById(videoId);
    if (!currentVideo) {
        throw new ApiError(404, "Video not found");
    }

    // Find videos with strings in tags array that match current video's tags
    // Or same category
    const relatedVideos = await Video.aggregate([
        {
            $match: {
                _id: { $ne: new mongoose.Types.ObjectId(videoId as string) }, // Exclude current
                isPublished: true,
                $or: [
                    { category: currentVideo.category },
                    { tags: { $in: currentVideo.tags } }
                ]
            }
        },
        {
            $sample: { size: 10 } // Randomize result for variety among matches
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
        }
    ]);

    return res.status(200).json(new ApiResponse(200, relatedVideos, "Related videos fetched"));
});

const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId as string)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // @ts-ignore
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    // TODO: delete video and thumbnail from cloudinary as well

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId as string)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // @ts-ignore
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, video, "Video publish status toggled successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    incrementViewCount,
    togglePinComment,
    getRelatedVideos
}
