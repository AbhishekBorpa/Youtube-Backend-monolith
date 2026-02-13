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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStats = void 0;
var user_model_1 = require("../models/user.model");
var video_model_1 = require("../models/video.model");
var comment_model_1 = require("../models/comment.model");
var like_model_1 = require("../models/like.model");
var tweet_model_1 = require("../models/tweet.model");
var ApiResponse_1 = require("../utils/ApiResponse");
var asyncHandler_1 = require("../utils/asyncHandler");
var getSystemStats = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalUsers, totalVideos, totalTweets, totalComments, totalLikes, totalViewsResult, totalViews, stats;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, user_model_1.User.countDocuments()];
            case 1:
                totalUsers = _b.sent();
                return [4 /*yield*/, video_model_1.Video.countDocuments()];
            case 2:
                totalVideos = _b.sent();
                return [4 /*yield*/, tweet_model_1.Tweet.countDocuments()];
            case 3:
                totalTweets = _b.sent();
                return [4 /*yield*/, comment_model_1.Comment.countDocuments()];
            case 4:
                totalComments = _b.sent();
                return [4 /*yield*/, like_model_1.Like.countDocuments()];
            case 5:
                totalLikes = _b.sent();
                return [4 /*yield*/, video_model_1.Video.aggregate([
                        {
                            $group: {
                                _id: null,
                                totalViews: { $sum: "$views" }
                            }
                        }
                    ])];
            case 6:
                totalViewsResult = _b.sent();
                totalViews = ((_a = totalViewsResult[0]) === null || _a === void 0 ? void 0 : _a.totalViews) || 0;
                stats = {
                    totalUsers: totalUsers,
                    totalVideos: totalVideos,
                    totalTweets: totalTweets,
                    totalComments: totalComments,
                    totalLikes: totalLikes,
                    totalViews: totalViews
                };
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, stats, "System stats fetched successfully"))];
        }
    });
}); });
exports.getSystemStats = getSystemStats;
