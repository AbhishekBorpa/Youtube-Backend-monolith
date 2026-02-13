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
exports.voteOnTweetPoll = exports.deleteTweet = exports.updateTweet = exports.getUserTweets = exports.createTweet = void 0;
var mongoose_1 = require("mongoose");
var tweet_model_1 = require("../models/tweet.model");
var ApiError_1 = require("../utils/ApiError");
var cloudinary_1 = require("../utils/cloudinary");
var ApiResponse_1 = require("../utils/ApiResponse");
var asyncHandler_1 = require("../utils/asyncHandler");
var createTweet = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, content, isPoll, pollOptions, imageLocalPath, image, tweetData, tweet;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, content = _a.content, isPoll = _a.isPoll, pollOptions = _a.pollOptions;
                if (!content)
                    throw new ApiError_1.ApiError(400, "Content is required");
                imageLocalPath = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
                if (!imageLocalPath) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(imageLocalPath)];
            case 1:
                image = _d.sent();
                _d.label = 2;
            case 2:
                tweetData = {
                    content: content,
                    image: (image === null || image === void 0 ? void 0 : image.url) || "",
                    // @ts-ignore
                    owner: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
                    isPoll: isPoll || false
                };
                if (isPoll && pollOptions && Array.isArray(pollOptions)) {
                    tweetData.pollOptions = pollOptions.map(function (opt) { return ({ text: opt, votes: 0, voters: [] }); });
                }
                return [4 /*yield*/, tweet_model_1.Tweet.create(tweetData)];
            case 3:
                tweet = _d.sent();
                return [2 /*return*/, res.status(201).json(new ApiResponse_1.ApiResponse(201, tweet, "Tweet created successfully"))];
        }
    });
}); });
exports.createTweet = createTweet;
var getUserTweets = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, tweets;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                if (!(0, mongoose_1.isValidObjectId)(userId))
                    throw new ApiError_1.ApiError(400, "Invalid userId");
                return [4 /*yield*/, tweet_model_1.Tweet.find({ owner: userId })];
            case 1:
                tweets = _a.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, tweets, "Tweets fetched successfully"))];
        }
    });
}); });
exports.getUserTweets = getUserTweets;
var voteOnTweetPoll = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tweetId, optionIndex, tweet, index, userId, hasVoted;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.params, tweetId = _a.tweetId, optionIndex = _a.optionIndex;
                if (!(0, mongoose_1.isValidObjectId)(tweetId))
                    throw new ApiError_1.ApiError(400, "Invalid tweetId");
                return [4 /*yield*/, tweet_model_1.Tweet.findById(tweetId)];
            case 1:
                tweet = _c.sent();
                if (!tweet)
                    throw new ApiError_1.ApiError(404, "Tweet not found");
                if (!tweet.isPoll || !tweet.pollOptions)
                    throw new ApiError_1.ApiError(400, "This tweet is not a poll");
                index = parseInt(optionIndex);
                if (index < 0 || index >= tweet.pollOptions.length)
                    throw new ApiError_1.ApiError(400, "Invalid option index");
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
                hasVoted = tweet.pollOptions.some(function (opt) { return opt.voters.includes(userId); });
                if (hasVoted)
                    throw new ApiError_1.ApiError(400, "You have already voted on this poll");
                tweet.pollOptions[index].votes += 1;
                tweet.pollOptions[index].voters.push(userId);
                return [4 /*yield*/, tweet.save()];
            case 2:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, tweet, "Vote recorded successfully"))];
        }
    });
}); });
exports.voteOnTweetPoll = voteOnTweetPoll;
var updateTweet = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tweetId, content, imageLocalPath, tweet, updateData, image, updatedTweet;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                tweetId = req.params.tweetId;
                content = req.body.content;
                imageLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                if (!content && !imageLocalPath) {
                    throw new ApiError_1.ApiError(400, "Content or image is required");
                }
                return [4 /*yield*/, tweet_model_1.Tweet.findById(tweetId)];
            case 1:
                tweet = _c.sent();
                if (!tweet)
                    throw new ApiError_1.ApiError(404, "Tweet not found");
                // @ts-ignore
                if (tweet.owner.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to edit this tweet");
                }
                updateData = {};
                if (content)
                    updateData.content = content;
                if (!imageLocalPath) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(imageLocalPath)];
            case 2:
                image = _c.sent();
                if (!image.url)
                    throw new ApiError_1.ApiError(400, "Error while uploading on image");
                updateData.image = image.url;
                _c.label = 3;
            case 3: return [4 /*yield*/, tweet_model_1.Tweet.findByIdAndUpdate(tweetId, {
                    $set: updateData
                }, { new: true })];
            case 4:
                updatedTweet = _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedTweet, "Tweet updated successfully"))];
        }
    });
}); });
exports.updateTweet = updateTweet;
var deleteTweet = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tweetId, tweet;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tweetId = req.params.tweetId;
                return [4 /*yield*/, tweet_model_1.Tweet.findById(tweetId)];
            case 1:
                tweet = _b.sent();
                if (!tweet)
                    throw new ApiError_1.ApiError(404, "Tweet not found");
                // @ts-ignore
                if (tweet.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to delete this tweet");
                }
                return [4 /*yield*/, tweet_model_1.Tweet.findByIdAndDelete(tweetId)];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Tweet deleted successfully"))];
        }
    });
}); });
exports.deleteTweet = deleteTweet;
