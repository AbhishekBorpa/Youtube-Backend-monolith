"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedVideos = exports.togglePinComment = exports.incrementViewCount = exports.togglePublishStatus = exports.deleteVideo = exports.updateVideo = exports.getVideoById = exports.publishAVideo = exports.getAllVideos = void 0;
var mongoose_1 = require("mongoose");
var asyncHandler_1 = require("../utils/asyncHandler");
var ApiError_1 = require("../utils/ApiError");
var video_model_1 = require("../models/video.model");
var cloudinary_1 = require("../utils/cloudinary");
var ApiResponse_1 = require("../utils/ApiResponse");
var mongoose_2 = __importDefault(require("mongoose"));
var activityTracker_1 = require("../utils/activityTracker");
var getAllVideos = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, query, sortBy, sortType, userId, minDuration, maxDuration, uploadDate, category, type, pipeline, durationMatch, date, videoAggregate, options, videos;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, query = _a.query, sortBy = _a.sortBy, sortType = _a.sortType, userId = _a.userId, minDuration = _a.minDuration, maxDuration = _a.maxDuration, uploadDate = _a.uploadDate, category = _a.category, type = _a.type;
                pipeline = [];
                if (query) {
                    pipeline.push({
                        $match: {
                            $or: [
                                { title: { $regex: query, $options: "i" } },
                                { description: { $regex: query, $options: "i" } },
                                { tags: { $in: [new RegExp(query, "i")] } }
                            ]
                        }
                    });
                }
                if (userId) {
                    pipeline.push({
                        $match: {
                            owner: new mongoose_2.default.Types.ObjectId(userId)
                        }
                    });
                }
                if (minDuration || maxDuration) {
                    durationMatch = {};
                    if (minDuration)
                        durationMatch.$gte = parseInt(minDuration);
                    if (maxDuration)
                        durationMatch.$lte = parseInt(maxDuration);
                    pipeline.push({ $match: { duration: durationMatch } });
                }
                if (uploadDate) {
                    date = new Date();
                    if (uploadDate === 'today')
                        date.setHours(0, 0, 0, 0);
                    else if (uploadDate === 'week')
                        date.setDate(date.getDate() - 7);
                    else if (uploadDate === 'month')
                        date.setMonth(date.getMonth() - 1);
                    else if (uploadDate === 'year')
                        date.setFullYear(date.getFullYear() - 1);
                    pipeline.push({ $match: { createdAt: { $gte: date } } });
                }
                if (category) {
                    pipeline.push({
                        $match: { category: category }
                    });
                }
                if (type) {
                    pipeline.push({
                        $match: { type: type } // 'video' or 'short'
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
                    $sort: (_d = {},
                        _d[sortBy || "createdAt"] = sortType === "asc" ? 1 : -1,
                        _d)
                });
                videoAggregate = video_model_1.Video.aggregate(pipeline);
                options = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
                return [4 /*yield*/, video_model_1.Video.aggregatePaginate(videoAggregate, options)];
            case 1:
                videos = _e.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, videos, "Videos fetched successfully"))];
        }
    });
}); });
exports.getAllVideos = getAllVideos;
var publishAVideo = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, tags, category, type, publishAt, chapters, files, videoFileLocalPath, thumbnailLocalPath, videoFile, thumbnail, processedTags, videoData, video, createdVideo;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description, tags = _a.tags, category = _a.category, type = _a.type, publishAt = _a.publishAt, chapters = _a.chapters;
                if ([title, description, category, type].some(function (field) { return (field === null || field === void 0 ? void 0 : field.trim()) === ""; })) {
                    throw new ApiError_1.ApiError(400, "All fields are required");
                }
                files = req.files;
                videoFileLocalPath = (_c = (_b = files === null || files === void 0 ? void 0 : files.videoFile) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path;
                thumbnailLocalPath = (_e = (_d = files === null || files === void 0 ? void 0 : files.thumbnail) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.path;
                if (!videoFileLocalPath) {
                    throw new ApiError_1.ApiError(400, "Video file is required");
                }
                if (!thumbnailLocalPath) {
                    throw new ApiError_1.ApiError(400, "Thumbnail is required");
                }
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(videoFileLocalPath)];
            case 1:
                videoFile = _f.sent();
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(thumbnailLocalPath)];
            case 2:
                thumbnail = _f.sent();
                if (!videoFile) {
                    throw new ApiError_1.ApiError(400, "Video file upload failed");
                }
                if (!thumbnail) {
                    throw new ApiError_1.ApiError(400, "Thumbnail upload failed");
                }
                processedTags = [];
                if (tags) {
                    if (Array.isArray(tags)) {
                        processedTags = tags;
                    }
                    else if (typeof tags === 'string') {
                        processedTags = tags.split(',').map(function (tag) { return tag.trim(); });
                    }
                }
                videoData = {
                    title: title,
                    description: description,
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
                    }
                    catch (e) {
                        videoData.chapters = [];
                    }
                }
                return [4 /*yield*/, video_model_1.Video.create(videoData)];
            case 3:
                video = _f.sent();
                return [4 /*yield*/, video_model_1.Video.findById(video._id)];
            case 4:
                createdVideo = _f.sent();
                if (!createdVideo) {
                    throw new ApiError_1.ApiError(500, "Something went wrong while uploading the video");
                }
                // @ts-ignore
                return [4 /*yield*/, (0, activityTracker_1.logActivity)(req.user._id, "UPLOAD_VIDEO", video._id, "Video")];
            case 5:
                // @ts-ignore
                _f.sent();
                return [2 /*return*/, res.status(201).json(new ApiResponse_1.ApiResponse(200, createdVideo, "Video uploaded successfully"))];
        }
    });
}); });
exports.publishAVideo = publishAVideo;
var getVideoById = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, video;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                videoId = req.params.videoId;
                if (!mongoose_2.default.Types.ObjectId.isValid(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                return [4 /*yield*/, video_model_1.Video.findById(videoId).populate("owner", "username fullName avatar")];
            case 1:
                video = _a.sent();
                if (!video) {
                    throw new ApiError_1.ApiError(404, "Video not found");
                }
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, video, "Video fetched successfully"))];
        }
    });
}); });
exports.getVideoById = getVideoById;
var updateVideo = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, _a, title, description, tags, publishAt, chapters, thumbnailLocalPath, video, updateData, thumbnail, updatedVideo;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                videoId = req.params.videoId;
                _a = req.body, title = _a.title, description = _a.description, tags = _a.tags, publishAt = _a.publishAt, chapters = _a.chapters;
                thumbnailLocalPath = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                if (!title && !description && !thumbnailLocalPath && !tags && !publishAt && !chapters) {
                    throw new ApiError_1.ApiError(400, "At least one field is required to update");
                }
                return [4 /*yield*/, video_model_1.Video.findById(videoId)];
            case 1:
                video = _d.sent();
                if (!video) {
                    throw new ApiError_1.ApiError(404, "Video not found");
                }
                // @ts-ignore
                if (video.owner.toString() !== ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to update this video");
                }
                updateData = {};
                if (title)
                    updateData.title = title;
                if (description)
                    updateData.description = description;
                if (tags) {
                    if (Array.isArray(tags)) {
                        updateData.tags = tags;
                    }
                    else if (typeof tags === 'string') {
                        updateData.tags = tags.split(',').map(function (tag) { return tag.trim(); });
                    }
                }
                if (publishAt)
                    updateData.publishAt = new Date(publishAt);
                if (chapters) {
                    try {
                        updateData.chapters = typeof chapters === 'string' ? JSON.parse(chapters) : chapters;
                    }
                    catch (e) {
                        // ignore
                    }
                }
                if (!thumbnailLocalPath) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(thumbnailLocalPath)];
            case 2:
                thumbnail = _d.sent();
                if (!thumbnail.url) {
                    throw new ApiError_1.ApiError(400, "Error while uploading thumbnail");
                }
                updateData.thumbnail = thumbnail.url;
                _d.label = 3;
            case 3: return [4 /*yield*/, video_model_1.Video.findByIdAndUpdate(videoId, {
                    $set: updateData
                }, { new: true })];
            case 4:
                updatedVideo = _d.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedVideo, "Video updated successfully"))];
        }
    });
}); });
exports.updateVideo = updateVideo;
var incrementViewCount = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, video;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                return [4 /*yield*/, video_model_1.Video.findByIdAndUpdate(videoId, {
                        $inc: { views: 1 }
                    }, { new: true })];
            case 1:
                video = _a.sent();
                if (!video) {
                    throw new ApiError_1.ApiError(404, "Video not found");
                }
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, video, "View count incremented successfully"))];
        }
    });
}); });
exports.incrementViewCount = incrementViewCount;
var togglePinComment = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, videoId, commentId, video;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.params, videoId = _a.videoId, commentId = _a.commentId;
                if (!(0, mongoose_1.isValidObjectId)(videoId) || !(0, mongoose_1.isValidObjectId)(commentId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video or comment ID");
                }
                return [4 /*yield*/, video_model_1.Video.findById(videoId)];
            case 1:
                video = _d.sent();
                if (!video)
                    throw new ApiError_1.ApiError(404, "Video not found");
                // @ts-ignore
                if (video.owner.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to pin comments on this video");
                }
                // Toggle logic: if already pinned, unpin; otherwise pin
                if (((_c = video.pinnedComment) === null || _c === void 0 ? void 0 : _c.toString()) === commentId) {
                    video.pinnedComment = undefined;
                }
                else {
                    // @ts-ignore
                    video.pinnedComment = commentId;
                }
                return [4 /*yield*/, video.save({ validateBeforeSave: false })];
            case 2:
                _d.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, video, "Comment pin status toggled successfully"))];
        }
    });
}); });
exports.togglePinComment = togglePinComment;
var getRelatedVideos = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, currentVideo, relatedVideos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                return [4 /*yield*/, video_model_1.Video.findById(videoId)];
            case 1:
                currentVideo = _a.sent();
                if (!currentVideo) {
                    throw new ApiError_1.ApiError(404, "Video not found");
                }
                return [4 /*yield*/, video_model_1.Video.aggregate([
                        {
                            $match: {
                                _id: { $ne: new mongoose_2.default.Types.ObjectId(videoId) }, // Exclude current
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
                    ])];
            case 2:
                relatedVideos = _a.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, relatedVideos, "Related videos fetched"))];
        }
    });
}); });
exports.getRelatedVideos = getRelatedVideos;
var deleteVideo = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, video;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                return [4 /*yield*/, video_model_1.Video.findById(videoId)];
            case 1:
                video = _b.sent();
                if (!video) {
                    throw new ApiError_1.ApiError(404, "Video not found");
                }
                // @ts-ignore
                if (video.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to delete this video");
                }
                return [4 /*yield*/, video_model_1.Video.findByIdAndDelete(videoId)
                    // TODO: delete video and thumbnail from cloudinary as well
                ];
            case 2:
                _b.sent();
                // TODO: delete video and thumbnail from cloudinary as well
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Video deleted successfully"))];
        }
    });
}); });
exports.deleteVideo = deleteVideo;
var togglePublishStatus = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, video;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                return [4 /*yield*/, video_model_1.Video.findById(videoId)];
            case 1:
                video = _b.sent();
                if (!video) {
                    throw new ApiError_1.ApiError(404, "Video not found");
                }
                // @ts-ignore
                if (video.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to update this video");
                }
                video.isPublished = !video.isPublished;
                return [4 /*yield*/, video.save({ validateBeforeSave: false })];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, video, "Video publish status toggled successfully"))];
        }
    });
}); });
exports.togglePublishStatus = togglePublishStatus;
