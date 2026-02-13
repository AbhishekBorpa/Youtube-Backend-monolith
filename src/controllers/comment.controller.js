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
exports.pinComment = exports.toggleCommentHeart = exports.getCommentReplies = exports.deleteComment = exports.updateComment = exports.addComment = exports.getVideoComments = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var comment_model_1 = require("../models/comment.model");
var video_model_1 = require("../models/video.model");
var mongoose_2 = require("mongoose");
var ApiError_1 = require("../utils/ApiError");
var ApiResponse_1 = require("../utils/ApiResponse");
var asyncHandler_1 = require("../utils/asyncHandler");
var getVideoComments = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, _a, _b, page, _c, limit, comments;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                videoId = req.params.videoId;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                return [4 /*yield*/, comment_model_1.Comment.aggregate([
                        {
                            $match: {
                                video: new mongoose_1.default.Types.ObjectId(videoId),
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
                    ])];
            case 1:
                comments = _d.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, comments, "Comments fetched successfully"))];
        }
    });
}); });
exports.getVideoComments = getVideoComments;
var addComment = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, _a, content, parentId, comment;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                videoId = req.params.videoId;
                _a = req.body, content = _a.content, parentId = _a.parentId;
                if (!content)
                    throw new ApiError_1.ApiError(400, "Content is required");
                return [4 /*yield*/, comment_model_1.Comment.create({
                        content: content,
                        video: videoId,
                        // @ts-ignore
                        owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                        parentComment: parentId || null
                    })];
            case 1:
                comment = _c.sent();
                return [2 /*return*/, res.status(201).json(new ApiResponse_1.ApiResponse(201, comment, "Comment added successfully"))];
        }
    });
}); });
exports.addComment = addComment;
var getCommentReplies = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, _a, _b, page, _c, limit, replies;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                commentId = req.params.commentId;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                return [4 /*yield*/, comment_model_1.Comment.aggregate([
                        {
                            $match: {
                                parentComment: new mongoose_1.default.Types.ObjectId(commentId)
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
                    ])];
            case 1:
                replies = _d.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, replies, "Replies fetched successfully"))];
        }
    });
}); });
exports.getCommentReplies = getCommentReplies;
var updateComment = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, content, comment, updatedComment;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                commentId = req.params.commentId;
                content = req.body.content;
                if (!content)
                    throw new ApiError_1.ApiError(400, "Content is required");
                return [4 /*yield*/, comment_model_1.Comment.findById(commentId)];
            case 1:
                comment = _b.sent();
                if (!comment)
                    throw new ApiError_1.ApiError(404, "Comment not found");
                // @ts-ignore
                if (comment.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to edit this comment");
                }
                return [4 /*yield*/, comment_model_1.Comment.findByIdAndUpdate(commentId, {
                        $set: {
                            content: content
                        }
                    }, { new: true })];
            case 2:
                updatedComment = _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedComment, "Comment updated successfully"))];
        }
    });
}); });
exports.updateComment = updateComment;
var deleteComment = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comment;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                commentId = req.params.commentId;
                return [4 /*yield*/, comment_model_1.Comment.findById(commentId)
                    // @ts-ignore
                ];
            case 1:
                comment = _b.sent();
                // @ts-ignore
                if ((comment === null || comment === void 0 ? void 0 : comment.owner.toString()) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to delete this comment");
                }
                return [4 /*yield*/, comment_model_1.Comment.findByIdAndDelete(commentId)];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Comment deleted successfully"))];
        }
    });
}); });
exports.deleteComment = deleteComment;
var toggleCommentHeart = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comment, video;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                commentId = req.params.commentId;
                if (!(0, mongoose_2.isValidObjectId)(commentId))
                    throw new ApiError_1.ApiError(400, "Invalid comment ID");
                return [4 /*yield*/, comment_model_1.Comment.findById(commentId)];
            case 1:
                comment = _b.sent();
                if (!comment)
                    throw new ApiError_1.ApiError(404, "Comment not found");
                return [4 /*yield*/, video_model_1.Video.findById(comment.video)];
            case 2:
                video = _b.sent();
                if (!video)
                    throw new ApiError_1.ApiError(404, "Video not found");
                // Check if requester is the owner of the VIDEO (not the comment)
                // @ts-ignore
                if (video.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    throw new ApiError_1.ApiError(403, "Only the video owner can heart comments");
                }
                comment.ownerHearted = !comment.ownerHearted;
                return [4 /*yield*/, comment.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, comment, "Comment heart toggled"))];
        }
    });
}); });
exports.toggleCommentHeart = toggleCommentHeart;
var pinComment = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comment, video;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                commentId = req.params.commentId;
                if (!(0, mongoose_2.isValidObjectId)(commentId))
                    throw new ApiError_1.ApiError(400, "Invalid comment ID");
                return [4 /*yield*/, comment_model_1.Comment.findById(commentId)];
            case 1:
                comment = _b.sent();
                if (!comment)
                    throw new ApiError_1.ApiError(404, "Comment not found");
                return [4 /*yield*/, video_model_1.Video.findById(comment.video)];
            case 2:
                video = _b.sent();
                if (!video)
                    throw new ApiError_1.ApiError(404, "Video not found");
                // @ts-ignore
                if (video.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    throw new ApiError_1.ApiError(403, "Only the video owner can pin comments");
                }
                if (!comment.isPinned) return [3 /*break*/, 5];
                comment.isPinned = false;
                return [4 /*yield*/, comment.save()];
            case 3:
                _b.sent();
                video.pinnedComment = undefined;
                return [4 /*yield*/, video.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, comment, "Comment unpinned"))];
            case 5:
                if (!video.pinnedComment) return [3 /*break*/, 7];
                return [4 /*yield*/, comment_model_1.Comment.findByIdAndUpdate(video.pinnedComment, { isPinned: false })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                comment.isPinned = true;
                return [4 /*yield*/, comment.save()];
            case 8:
                _b.sent();
                video.pinnedComment = comment._id;
                return [4 /*yield*/, video.save()];
            case 9:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, comment, "Comment pinned successfully"))];
        }
    });
}); });
exports.pinComment = pinComment;
