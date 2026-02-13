"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikedVideos = exports.toggleTweetLike = exports.toggleCommentLike = exports.toggleVideoLike = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var like_model_1 = require("../models/like.model");
var ApiError_1 = require("../utils/ApiError");
var ApiResponse_1 = require("../utils/ApiResponse");
var asyncHandler_1 = require("../utils/asyncHandler");
var activityTracker_1 = require("../utils/activityTracker");
var toggleVideoLike = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, existingLike;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId))
                    throw new ApiError_1.ApiError(400, "Invalid videoId");
                return [4 /*yield*/, like_model_1.Like.findOne({
                        video: videoId,
                        // @ts-ignore
                        likedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
                    })];
            case 1:
                existingLike = _c.sent();
                if (!existingLike) return [3 /*break*/, 3];
                return [4 /*yield*/, like_model_1.Like.findByIdAndDelete(existingLike._id)];
            case 2:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isLiked: false }, "Unliked video"))];
            case 3: return [4 /*yield*/, like_model_1.Like.create({
                    video: videoId,
                    // @ts-ignore
                    likedBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
                })
                // @ts-ignore
            ];
            case 4:
                _c.sent();
                // @ts-ignore
                return [4 /*yield*/, (0, activityTracker_1.logActivity)(req.user._id, "LIKE_VIDEO", videoId, "Video")];
            case 5:
                // @ts-ignore
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isLiked: true }, "Liked video"))];
        }
    });
}); });
exports.toggleVideoLike = toggleVideoLike;
var toggleCommentLike = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, existingLike;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                commentId = req.params.commentId;
                if (!(0, mongoose_1.isValidObjectId)(commentId))
                    throw new ApiError_1.ApiError(400, "Invalid commentId");
                return [4 /*yield*/, like_model_1.Like.findOne({
                        comment: commentId,
                        // @ts-ignore
                        likedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
                    })];
            case 1:
                existingLike = _c.sent();
                if (!existingLike) return [3 /*break*/, 3];
                return [4 /*yield*/, like_model_1.Like.findByIdAndDelete(existingLike._id)];
            case 2:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isLiked: false }, "Unliked comment"))];
            case 3: return [4 /*yield*/, like_model_1.Like.create({
                    comment: commentId,
                    // @ts-ignore
                    likedBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
                })
                // @ts-ignore
            ];
            case 4:
                _c.sent();
                // @ts-ignore
                return [4 /*yield*/, (0, activityTracker_1.logActivity)(req.user._id, "LIKE_COMMENT", commentId, "Comment")];
            case 5:
                // @ts-ignore
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isLiked: true }, "Liked comment"))];
        }
    });
}); });
exports.toggleCommentLike = toggleCommentLike;
var toggleTweetLike = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tweetId, existingLike;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                tweetId = req.params.tweetId;
                if (!(0, mongoose_1.isValidObjectId)(tweetId))
                    throw new ApiError_1.ApiError(400, "Invalid tweetId");
                return [4 /*yield*/, like_model_1.Like.findOne({
                        tweet: tweetId,
                        // @ts-ignore
                        likedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
                    })];
            case 1:
                existingLike = _c.sent();
                if (!existingLike) return [3 /*break*/, 3];
                return [4 /*yield*/, like_model_1.Like.findByIdAndDelete(existingLike._id)];
            case 2:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isLiked: false }, "Unliked tweet"))];
            case 3: return [4 /*yield*/, like_model_1.Like.create({
                    tweet: tweetId,
                    // @ts-ignore
                    likedBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
                })
                // @ts-ignore
            ];
            case 4:
                _c.sent();
                // @ts-ignore
                return [4 /*yield*/, (0, activityTracker_1.logActivity)(req.user._id, "LIKE_TWEET", tweetId, "Tweet")];
            case 5:
                // @ts-ignore
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isLiked: true }, "Liked tweet"))];
        }
    });
}); });
exports.toggleTweetLike = toggleTweetLike;
var getLikedVideos = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var likedVideosAggregate, likedVideos;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, like_model_1.Like.aggregate([
                    {
                        $match: {
                            // @ts-ignore
                            likedBy: new mongoose_1.default.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)
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
                ])];
            case 1:
                likedVideosAggregate = _b.sent();
                likedVideos = likedVideosAggregate.map(function (item) { return item.video; });
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, likedVideos, "Liked videos fetched successfully"))];
        }
    });
}); });
exports.getLikedVideos = getLikedVideos;
