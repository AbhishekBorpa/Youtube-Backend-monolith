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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeSession = exports.getUserSessions = exports.getUserPreferences = exports.updateUserPreferences = exports.getBlockedUsers = exports.unblockUser = exports.blockUser = exports.removeFromWatchHistory = exports.clearWatchHistory = exports.changeCurrentPassword = exports.refreshAccessToken = exports.getWatchHistory = exports.getUserChannelProfile = exports.updateUserCoverImage = exports.updateUserAvatar = exports.updateAccountDetails = exports.getCurrentUser = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mongoose_1 = __importStar(require("mongoose"));
var asyncHandler_1 = require("../utils/asyncHandler");
var ApiError_1 = require("../utils/ApiError");
var user_model_1 = require("../models/user.model");
var session_model_1 = require("../models/session.model");
var cloudinary_1 = require("../utils/cloudinary");
var ApiResponse_1 = require("../utils/ApiResponse");
var generateAccessAndRefreshTokens = function (userId, req) { return __awaiter(void 0, void 0, void 0, function () {
    var user, accessToken, refreshToken, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, user_model_1.User.findById(userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new ApiError_1.ApiError(404, "User not found");
                }
                accessToken = user.generateAccessToken();
                refreshToken = user.generateRefreshToken();
                if (!req) return [3 /*break*/, 3];
                // Save to Session model
                return [4 /*yield*/, session_model_1.Session.create({
                        user: userId,
                        refreshToken: refreshToken,
                        ip: req.ip || "0.0.0.0",
                        userAgent: req.headers["user-agent"] || "Unknown",
                        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days
                    })];
            case 2:
                // Save to Session model
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                // Fallback (should not happen in new flow) or test env
                user.refreshToken = refreshToken;
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
            case 6:
                error_1 = _a.sent();
                throw new ApiError_1.ApiError(500, "Something went wrong while generating referesh and access token");
            case 7: return [2 /*return*/];
        }
    });
}); };
var registerUser = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, username, password, existedUser, files, avatarLocalPath, coverImageLocalPath, avatar, coverImage, user, createdUser;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, fullName = _a.fullName, email = _a.email, username = _a.username, password = _a.password;
                if ([fullName, email, username, password].some(function (field) { return (field === null || field === void 0 ? void 0 : field.trim()) === ""; })) {
                    throw new ApiError_1.ApiError(400, "All fields are required");
                }
                return [4 /*yield*/, user_model_1.User.findOne({
                        $or: [{ username: username }, { email: email }]
                    })];
            case 1:
                existedUser = _d.sent();
                if (existedUser) {
                    throw new ApiError_1.ApiError(409, "User with email or username already exists");
                }
                files = req.files;
                avatarLocalPath = (_c = (_b = files === null || files === void 0 ? void 0 : files.avatar) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path;
                if (files && Array.isArray(files.coverImage) && files.coverImage.length > 0) {
                    coverImageLocalPath = files.coverImage[0].path;
                }
                if (!avatarLocalPath) {
                    throw new ApiError_1.ApiError(400, "Avatar file is required");
                }
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(avatarLocalPath)];
            case 2:
                avatar = _d.sent();
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(coverImageLocalPath)];
            case 3:
                coverImage = _d.sent();
                if (!avatar) {
                    throw new ApiError_1.ApiError(400, "Avatar file is required");
                }
                return [4 /*yield*/, user_model_1.User.create({
                        fullName: fullName,
                        avatar: avatar.url,
                        coverImage: (coverImage === null || coverImage === void 0 ? void 0 : coverImage.url) || "",
                        email: email,
                        password: password,
                        username: username.toLowerCase()
                    })];
            case 4:
                user = _d.sent();
                return [4 /*yield*/, user_model_1.User.findById(user._id).select("-password -refreshToken")];
            case 5:
                createdUser = _d.sent();
                if (!createdUser) {
                    throw new ApiError_1.ApiError(500, "Something went wrong while registering the user");
                }
                return [2 /*return*/, res.status(201).json(new ApiResponse_1.ApiResponse(200, createdUser, "User registered Successfully"))];
        }
    });
}); });
exports.registerUser = registerUser;
var loginUser = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, username, password, user, isPasswordValid, _b, accessToken, refreshToken, loggedInUser, options;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, email = _a.email, username = _a.username, password = _a.password;
                if (!username && !email) {
                    throw new ApiError_1.ApiError(400, "username or email is required");
                }
                return [4 /*yield*/, user_model_1.User.findOne({
                        $or: [{ username: username }, { email: email }]
                    })];
            case 1:
                user = _c.sent();
                if (!user) {
                    throw new ApiError_1.ApiError(404, "User does not exist");
                }
                return [4 /*yield*/, user.isPasswordCorrect(password)];
            case 2:
                isPasswordValid = _c.sent();
                if (!isPasswordValid) {
                    throw new ApiError_1.ApiError(401, "Invalid user credentials");
                }
                return [4 /*yield*/, generateAccessAndRefreshTokens(user._id, req)];
            case 3:
                _b = _c.sent(), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                return [4 /*yield*/, user_model_1.User.findById(user._id).select("-password -refreshToken")];
            case 4:
                loggedInUser = _c.sent();
                options = {
                    httpOnly: true,
                    secure: true
                };
                return [2 /*return*/, res
                        .status(200)
                        .cookie("accessToken", accessToken, options)
                        .cookie("refreshToken", refreshToken, options)
                        .json(new ApiResponse_1.ApiResponse(200, {
                        user: loggedInUser,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }, "User logged In Successfully"))];
        }
    });
}); });
exports.loginUser = loginUser;
var logoutUser = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var incomingRefreshToken, options;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
                if (!incomingRefreshToken) return [3 /*break*/, 2];
                return [4 /*yield*/, session_model_1.Session.findOneAndDelete({ refreshToken: incomingRefreshToken })];
            case 1:
                _b.sent();
                return [3 /*break*/, 4];
            case 2: 
            // Fallback: clear from user doc if using old system
            return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                // @ts-ignore
                (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
                    $unset: {
                        refreshToken: 1
                    }
                }, {
                    new: true
                })];
            case 3:
                // Fallback: clear from user doc if using old system
                _b.sent();
                _b.label = 4;
            case 4:
                options = {
                    httpOnly: true,
                    secure: true
                };
                return [2 /*return*/, res
                        .status(200)
                        .clearCookie("accessToken", options)
                        .clearCookie("refreshToken", options)
                        .json(new ApiResponse_1.ApiResponse(200, {}, "User logged Out"))];
        }
    });
}); });
exports.logoutUser = logoutUser;
var refreshAccessToken = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var incomingRefreshToken, decodedToken, user, session, options, _a, accessToken, newRefreshToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
                if (!incomingRefreshToken) {
                    throw new ApiError_1.ApiError(401, "unauthorized request");
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
                return [4 /*yield*/, user_model_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id)];
            case 2:
                user = _b.sent();
                if (!user) {
                    throw new ApiError_1.ApiError(401, "Invalid refresh token");
                }
                if (!(incomingRefreshToken !== (user === null || user === void 0 ? void 0 : user.refreshToken))) return [3 /*break*/, 4];
                return [4 /*yield*/, session_model_1.Session.findOne({ refreshToken: incomingRefreshToken })];
            case 3:
                session = _b.sent();
                if (!session) {
                    throw new ApiError_1.ApiError(401, "Refresh token is expired or used");
                }
                _b.label = 4;
            case 4:
                options = {
                    httpOnly: true,
                    secure: true
                };
                // Invalidate old session
                return [4 /*yield*/, session_model_1.Session.findOneAndDelete({ refreshToken: incomingRefreshToken })];
            case 5:
                // Invalidate old session
                _b.sent();
                return [4 /*yield*/, generateAccessAndRefreshTokens(user._id, req)];
            case 6:
                _a = _b.sent(), accessToken = _a.accessToken, newRefreshToken = _a.refreshToken;
                return [2 /*return*/, res
                        .status(200)
                        .cookie("accessToken", accessToken, options)
                        .cookie("refreshToken", newRefreshToken, options)
                        .json(new ApiResponse_1.ApiResponse(200, { accessToken: accessToken, refreshToken: newRefreshToken }, "Access token refreshed"))];
            case 7:
                error_2 = _b.sent();
                throw new ApiError_1.ApiError(401, (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || "Invalid refresh token");
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.refreshAccessToken = refreshAccessToken;
var changeCurrentPassword = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, oldPassword, newPassword, user, isPasswordCorrect;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                return [4 /*yield*/, user_model_1.User.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id)];
            case 1:
                user = _c.sent();
                return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.isPasswordCorrect(oldPassword))];
            case 2:
                isPasswordCorrect = _c.sent();
                if (!isPasswordCorrect) {
                    throw new ApiError_1.ApiError(400, "Invalid old password");
                }
                // @ts-ignore
                user.password = newPassword;
                // @ts-ignore
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 3:
                // @ts-ignore
                _c.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, {}, "Password changed successfully"))];
        }
    });
}); });
exports.changeCurrentPassword = changeCurrentPassword;
var getCurrentUser = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res
                .status(200)
                // @ts-ignore
                .json(new ApiResponse_1.ApiResponse(200, req.user, "User fetched successfully"))];
    });
}); });
exports.getCurrentUser = getCurrentUser;
var updateAccountDetails = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, socialLinks, updateData, user;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, fullName = _a.fullName, email = _a.email, socialLinks = _a.socialLinks;
                if (!fullName || !email) {
                    throw new ApiError_1.ApiError(400, "Full name and email are required");
                }
                updateData = { fullName: fullName, email: email };
                if (socialLinks) {
                    updateData.socialLinks = socialLinks;
                }
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                    // @ts-ignore
                    (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, {
                        $set: updateData
                    }, { new: true }).select("-password")];
            case 1:
                user = _c.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, user, "Account details updated successfully"))];
        }
    });
}); });
exports.updateAccountDetails = updateAccountDetails;
var updateUserAvatar = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var avatarLocalPath, avatar, user;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                avatarLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                if (!avatarLocalPath) {
                    throw new ApiError_1.ApiError(400, "Avatar file is missing");
                }
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(avatarLocalPath)];
            case 1:
                avatar = _c.sent();
                if (!avatar.url) {
                    throw new ApiError_1.ApiError(400, "Error while uploading on avatar");
                }
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                    // @ts-ignore
                    (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, {
                        $set: {
                            avatar: avatar.url
                        }
                    }, { new: true }).select("-password")];
            case 2:
                user = _c.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, user, "Avatar image updated successfully"))];
        }
    });
}); });
exports.updateUserAvatar = updateUserAvatar;
var updateUserCoverImage = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var coverImageLocalPath, coverImage, user;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                coverImageLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                if (!coverImageLocalPath) {
                    throw new ApiError_1.ApiError(400, "Cover image file is missing");
                }
                return [4 /*yield*/, (0, cloudinary_1.uploadOnCloudinary)(coverImageLocalPath)];
            case 1:
                coverImage = _c.sent();
                if (!coverImage.url) {
                    throw new ApiError_1.ApiError(400, "Error while uploading on cover image");
                }
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                    // @ts-ignore
                    (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, {
                        $set: {
                            coverImage: coverImage.url
                        }
                    }, { new: true }).select("-password")];
            case 2:
                user = _c.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, user, "Cover image updated successfully"))];
        }
    });
}); });
exports.updateUserCoverImage = updateUserCoverImage;
var getUserChannelProfile = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, channel;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                username = req.params.username;
                if (!(username === null || username === void 0 ? void 0 : username.trim())) {
                    throw new ApiError_1.ApiError(400, "username is missing");
                }
                return [4 /*yield*/, user_model_1.User.aggregate([
                        {
                            $match: {
                                username: username.toLowerCase()
                            }
                        },
                        {
                            $lookup: {
                                from: "subscriptions",
                                localField: "_id",
                                foreignField: "channel",
                                as: "subscribers"
                            }
                        },
                        {
                            $lookup: {
                                from: "subscriptions",
                                localField: "_id",
                                foreignField: "subscriber",
                                as: "subscribedTo"
                            }
                        },
                        {
                            $addFields: {
                                subscribersCount: {
                                    $size: "$subscribers"
                                },
                                channelsSubscribedToCount: {
                                    $size: "$subscribedTo"
                                },
                                isSubscribed: {
                                    $cond: {
                                        // @ts-ignore
                                        if: { $in: [(_a = req.user) === null || _a === void 0 ? void 0 : _a._id, "$subscribers.subscriber"] },
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                fullName: 1,
                                username: 1,
                                subscribersCount: 1,
                                channelsSubscribedToCount: 1,
                                isSubscribed: 1,
                                avatar: 1,
                                coverImage: 1,
                                email: 1
                            }
                        }
                    ])];
            case 1:
                channel = _b.sent();
                if (!(channel === null || channel === void 0 ? void 0 : channel.length)) {
                    throw new ApiError_1.ApiError(404, "channel does not exists");
                }
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, channel[0], "User channel fetched successfully"))];
        }
    });
}); });
exports.getUserChannelProfile = getUserChannelProfile;
var getWatchHistory = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.User.aggregate([
                    {
                        $match: {
                            // @ts-ignore
                            _id: new mongoose_1.default.Types.ObjectId(req.user._id)
                        }
                    },
                    {
                        $lookup: {
                            from: "videos",
                            localField: "watchHistory",
                            foreignField: "_id",
                            as: "watchHistory",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "owner",
                                        foreignField: "_id",
                                        as: "owner",
                                        pipeline: [
                                            {
                                                $project: {
                                                    fullName: 1,
                                                    username: 1,
                                                    avatar: 1
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $addFields: {
                                        owner: {
                                            $first: "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ])];
            case 1:
                user = _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"))];
        }
    });
}); });
exports.getWatchHistory = getWatchHistory;
var clearWatchHistory = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                // @ts-ignore
                (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
                    $set: {
                        watchHistory: []
                    }
                }, { new: true })];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Watch history cleared successfully"))];
        }
    });
}); });
exports.clearWatchHistory = clearWatchHistory;
var removeFromWatchHistory = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                }
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                    // @ts-ignore
                    (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
                        $pull: {
                            watchHistory: videoId
                        }
                    }, { new: true })];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Removed from watch history successfully"))];
        }
    });
}); });
exports.removeFromWatchHistory = removeFromWatchHistory;
var blockUser = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = req.params.userId;
                if (!(0, mongoose_1.isValidObjectId)(userId)) {
                    throw new ApiError_1.ApiError(400, "Invalid user ID");
                }
                // @ts-ignore
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) === userId) {
                    throw new ApiError_1.ApiError(400, "You cannot block yourself");
                }
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                    // @ts-ignore
                    (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, {
                        $addToSet: {
                            blockedUsers: userId
                        }
                    }, { new: true })];
            case 1:
                user = _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "User blocked successfully"))];
        }
    });
}); });
exports.blockUser = blockUser;
var unblockUser = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.params.userId;
                if (!(0, mongoose_1.isValidObjectId)(userId)) {
                    throw new ApiError_1.ApiError(400, "Invalid user ID");
                }
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(
                    // @ts-ignore
                    (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
                        $pull: {
                            blockedUsers: userId
                        }
                    }, { new: true })];
            case 1:
                user = _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "User unblocked successfully"))];
        }
    });
}); });
exports.unblockUser = unblockUser;
var getBlockedUsers = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).populate("blockedUsers", "fullName username avatar")];
            case 1:
                user = _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, user === null || user === void 0 ? void 0 : user.blockedUsers, "Blocked users fetched successfully"))];
        }
    });
}); });
exports.getBlockedUsers = getBlockedUsers;
var updateUserPreferences = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, emailNotifications, pushNotifications, language, user;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, emailNotifications = _a.emailNotifications, pushNotifications = _a.pushNotifications, language = _a.language;
                return [4 /*yield*/, user_model_1.User.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id)];
            case 1:
                user = _c.sent();
                if (!user)
                    throw new ApiError_1.ApiError(404, "User not found");
                if (emailNotifications !== undefined)
                    user.preferences.emailNotifications = emailNotifications;
                if (pushNotifications !== undefined)
                    user.preferences.pushNotifications = pushNotifications;
                if (language !== undefined)
                    user.preferences.language = language;
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 2:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, user.preferences, "Preferences updated"))];
        }
    });
}); });
exports.updateUserPreferences = updateUserPreferences;
var getUserPreferences = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)];
            case 1:
                user = _b.sent();
                if (!user)
                    throw new ApiError_1.ApiError(404, "User not found");
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, user.preferences, "Preferences fetched"))];
        }
    });
}); });
exports.getUserPreferences = getUserPreferences;
var getUserSessions = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessions;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, session_model_1.Session.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({ lastActive: -1 })];
            case 1:
                sessions = _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, sessions, "User sessions fetched"))];
        }
    });
}); });
exports.getUserSessions = getUserSessions;
var revokeSession = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, session;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sessionId = req.params.sessionId;
                return [4 /*yield*/, session_model_1.Session.findOneAndDelete({ _id: sessionId, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })];
            case 1:
                session = _b.sent();
                if (!session)
                    throw new ApiError_1.ApiError(404, "Session not found");
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Session revoked"))];
        }
    });
}); });
exports.revokeSession = revokeSession;
