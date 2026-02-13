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
exports.getUserWatchHistory = exports.getWatchProgress = exports.updateWatchProgress = void 0;
var mongoose_1 = require("mongoose");
var watchProgress_model_1 = require("../models/watchProgress.model");
var ApiError_1 = require("../utils/ApiError");
var ApiResponse_1 = require("../utils/ApiResponse");
var asyncHandler_1 = require("../utils/asyncHandler");
var updateWatchProgress = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, _a, positionSec, isCompleted, userId, progress;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                videoId = req.params.videoId;
                _a = req.body, positionSec = _a.positionSec, isCompleted = _a.isCompleted;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                if (positionSec === undefined || positionSec < 0) {
                    throw new ApiError_1.ApiError(400, "Valid position (seconds) is required");
                }
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
                return [4 /*yield*/, watchProgress_model_1.WatchProgress.findOneAndUpdate({ user: userId, video: videoId }, {
                        $set: {
                            positionSec: positionSec,
                            isCompleted: isCompleted || false,
                            lastWatched: new Date()
                        }
                    }, { new: true, upsert: true })];
            case 1:
                progress = _c.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, progress, "Watch progress updated"))];
        }
    });
}); });
exports.updateWatchProgress = updateWatchProgress;
var getWatchProgress = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, userId, progress;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, watchProgress_model_1.WatchProgress.findOne({ user: userId, video: videoId })];
            case 1:
                progress = _b.sent();
                if (!progress) {
                    // Return 0 progress if not found, rather than 404, as it's useful for UI
                    return [2 /*return*/, res
                            .status(200)
                            .json(new ApiResponse_1.ApiResponse(200, { positionSec: 0, isCompleted: false }, "No progress found, returned default"))];
                }
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, progress, "Watch progress fetched"))];
        }
    });
}); });
exports.getWatchProgress = getWatchProgress;
var getUserWatchHistory = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, page, _c, limit, history;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                return [4 /*yield*/, watchProgress_model_1.WatchProgress.find({ user: userId })
                        .sort({ lastWatched: -1 })
                        .limit(parseInt(limit))
                        .populate({
                        path: "video",
                        select: "title thumbnail duration owner views",
                        populate: {
                            path: "owner",
                            select: "username avatar"
                        }
                    })];
            case 1:
                history = _e.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, history, "Watch history fetched"))];
        }
    });
}); });
exports.getUserWatchHistory = getUserWatchHistory;
