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
exports.toggleWatchLater = exports.getWatchLater = exports.updatePlaylist = exports.deletePlaylist = exports.removeVideoFromPlaylist = exports.addVideoToPlaylist = exports.getPlaylistById = exports.getUserPlaylists = exports.createPlaylist = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var playlist_model_1 = require("../models/playlist.model");
var ApiError_1 = require("../utils/ApiError");
var ApiResponse_1 = require("../utils/ApiResponse");
var asyncHandler_1 = require("../utils/asyncHandler");
var createPlaylist = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, isPrivate, playlist;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, name = _a.name, description = _a.description, isPrivate = _a.isPrivate;
                if (!name || !description)
                    throw new ApiError_1.ApiError(400, "Name and description are required");
                return [4 /*yield*/, playlist_model_1.Playlist.create({
                        name: name,
                        description: description,
                        isPrivate: isPrivate || false,
                        // @ts-ignore
                        owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
                    })];
            case 1:
                playlist = _c.sent();
                return [2 /*return*/, res.status(201).json(new ApiResponse_1.ApiResponse(201, playlist, "Playlist created successfully"))];
        }
    });
}); });
exports.createPlaylist = createPlaylist;
var getUserPlaylists = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, isOwner, query, playlists;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.params.userId;
                if (!(0, mongoose_1.isValidObjectId)(userId))
                    throw new ApiError_1.ApiError(400, "Invalid userId");
                isOwner = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) === userId.toString();
                query = { owner: userId };
                if (!isOwner) {
                    query.isPrivate = false;
                }
                return [4 /*yield*/, playlist_model_1.Playlist.find(query)];
            case 1:
                playlists = _b.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, playlists, "User playlists fetched successfully"))];
        }
    });
}); });
exports.getUserPlaylists = getUserPlaylists;
var getPlaylistById = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playlistId, playlist;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                playlistId = req.params.playlistId;
                if (!(0, mongoose_1.isValidObjectId)(playlistId))
                    throw new ApiError_1.ApiError(400, "Invalid playlistId");
                return [4 /*yield*/, playlist_model_1.Playlist.findById(playlistId).populate("videos")];
            case 1:
                playlist = _b.sent();
                if (!playlist)
                    throw new ApiError_1.ApiError(404, "Playlist not found");
                // Privacy check
                if (playlist.isPrivate) {
                    // @ts-ignore
                    if (playlist.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                        throw new ApiError_1.ApiError(403, "This playlist is private");
                    }
                }
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, playlist, "Playlist fetched successfully"))];
        }
    });
}); });
exports.getPlaylistById = getPlaylistById;
var addVideoToPlaylist = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, playlistId, videoId, playlist;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, playlistId = _a.playlistId, videoId = _a.videoId;
                if (!(0, mongoose_1.isValidObjectId)(playlistId) || !(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid playlist or video ID");
                }
                return [4 /*yield*/, playlist_model_1.Playlist.findByIdAndUpdate(playlistId, {
                        $addToSet: { videos: videoId }
                    }, { new: true })];
            case 1:
                playlist = _b.sent();
                if (!playlist)
                    throw new ApiError_1.ApiError(404, "Playlist not found");
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, playlist, "Video added to playlist"))];
        }
    });
}); });
exports.addVideoToPlaylist = addVideoToPlaylist;
var removeVideoFromPlaylist = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, playlistId, videoId, playlist;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, playlistId = _a.playlistId, videoId = _a.videoId;
                if (!(0, mongoose_1.isValidObjectId)(playlistId) || !(0, mongoose_1.isValidObjectId)(videoId)) {
                    throw new ApiError_1.ApiError(400, "Invalid playlist or video ID");
                }
                return [4 /*yield*/, playlist_model_1.Playlist.findByIdAndUpdate(playlistId, {
                        $pull: { videos: videoId }
                    }, { new: true })];
            case 1:
                playlist = _b.sent();
                if (!playlist)
                    throw new ApiError_1.ApiError(404, "Playlist not found");
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, playlist, "Video removed from playlist"))];
        }
    });
}); });
exports.removeVideoFromPlaylist = removeVideoFromPlaylist;
var deletePlaylist = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playlistId, playlist;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                playlistId = req.params.playlistId;
                if (!(0, mongoose_1.isValidObjectId)(playlistId))
                    throw new ApiError_1.ApiError(400, "Invalid playlistId");
                return [4 /*yield*/, playlist_model_1.Playlist.findByIdAndDelete(playlistId)];
            case 1:
                playlist = _a.sent();
                if (!playlist)
                    throw new ApiError_1.ApiError(404, "Playlist not found");
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Playlist deleted successfully"))];
        }
    });
}); });
exports.deletePlaylist = deletePlaylist;
var updatePlaylist = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playlistId, _a, name, description, isPrivate, playlist;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                playlistId = req.params.playlistId;
                _a = req.body, name = _a.name, description = _a.description, isPrivate = _a.isPrivate;
                if (!(0, mongoose_1.isValidObjectId)(playlistId))
                    throw new ApiError_1.ApiError(400, "Invalid playlistId");
                if (!name || !description)
                    throw new ApiError_1.ApiError(400, "Name and description are required");
                return [4 /*yield*/, playlist_model_1.Playlist.findById(playlistId)];
            case 1:
                playlist = _c.sent();
                if (!playlist)
                    throw new ApiError_1.ApiError(404, "Playlist not found");
                // @ts-ignore
                if (playlist.owner.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    throw new ApiError_1.ApiError(403, "You are not authorized to update this playlist");
                }
                playlist.name = name;
                playlist.description = description;
                playlist.isPrivate = isPrivate !== undefined ? isPrivate : playlist.isPrivate;
                return [4 /*yield*/, playlist.save()];
            case 2:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, playlist, "Playlist updated successfully"))];
        }
    });
}); });
exports.updatePlaylist = updatePlaylist;
var getWatchLater = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var watchLater, playlist;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, playlist_model_1.Playlist.findOne({
                    // @ts-ignore
                    owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                    name: "Watch Later"
                })];
            case 1:
                watchLater = _c.sent();
                if (!!watchLater) return [3 /*break*/, 3];
                return [4 /*yield*/, playlist_model_1.Playlist.create({
                        name: "Watch Later",
                        description: "Your Watch Later list",
                        // @ts-ignore
                        owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
                    })];
            case 2:
                watchLater = _c.sent();
                _c.label = 3;
            case 3: return [4 /*yield*/, playlist_model_1.Playlist.findById(watchLater._id).populate("videos")];
            case 4:
                playlist = _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, playlist, "Watch Later fetched successfully"))];
        }
    });
}); });
exports.getWatchLater = getWatchLater;
var toggleWatchLater = (0, asyncHandler_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, watchLater, videoObjectId, isAdded;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                videoId = req.params.videoId;
                if (!(0, mongoose_1.isValidObjectId)(videoId))
                    throw new ApiError_1.ApiError(400, "Invalid video ID");
                return [4 /*yield*/, playlist_model_1.Playlist.findOne({
                        // @ts-ignore
                        owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                        name: "Watch Later"
                    })];
            case 1:
                watchLater = _c.sent();
                if (!!watchLater) return [3 /*break*/, 3];
                return [4 /*yield*/, playlist_model_1.Playlist.create({
                        name: "Watch Later",
                        description: "Your Watch Later list",
                        // @ts-ignore
                        owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                        isPrivate: true,
                        videos: []
                    })];
            case 2:
                watchLater = _c.sent();
                _c.label = 3;
            case 3:
                videoObjectId = new mongoose_1.default.Types.ObjectId(videoId);
                isAdded = watchLater.videos.some(function (v) { return v.equals(videoObjectId); });
                if (!isAdded) return [3 /*break*/, 5];
                watchLater.videos = watchLater.videos.filter(function (v) { return !v.equals(videoObjectId); });
                return [4 /*yield*/, watchLater.save()];
            case 4:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isAdded: false }, "Removed from Watch Later"))];
            case 5:
                watchLater.videos.push(videoObjectId);
                return [4 /*yield*/, watchLater.save()];
            case 6:
                _c.sent();
                return [2 /*return*/, res.status(200).json(new ApiResponse_1.ApiResponse(200, { isAdded: true }, "Added to Watch Later"))];
        }
    });
}); });
exports.toggleWatchLater = toggleWatchLater;
