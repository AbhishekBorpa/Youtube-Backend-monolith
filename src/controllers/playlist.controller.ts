import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { Request, Response } from "express"

const createPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, isPrivate } = req.body
    if (!name || !description) throw new ApiError(400, "Name and description are required")

    const playlist = await Playlist.create({
        name,
        description,
        isPrivate: isPrivate || false,
        // @ts-ignore
        owner: req.user?._id
    })

    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!isValidObjectId(userId as any)) throw new ApiError(400, "Invalid userId")

    // If requester is the owner, show all. If not, show only public or isPrivate: false
    // We need to check if req.user._id == userId
    // @ts-ignore
    const isOwner = req.user?._id.toString() === userId.toString();

    const query: any = { owner: userId };
    if (!isOwner) {
        query.isPrivate = false;
    }

    const playlists = await Playlist.find(query)

    return res.status(200).json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req: Request, res: Response) => {
    const { playlistId } = req.params
    if (!isValidObjectId(playlistId as any)) throw new ApiError(400, "Invalid playlistId")

    const playlist = await Playlist.findById(playlistId).populate("videos")

    if (!playlist) throw new ApiError(404, "Playlist not found")

    // Privacy check
    if (playlist.isPrivate) {
        // @ts-ignore
        if (playlist.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(403, "This playlist is private")
        }
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId as any) || !isValidObjectId(videoId as any)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { videos: videoId }
        },
        { new: true }
    )

    if (!playlist) throw new ApiError(404, "Playlist not found")

    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId as any) || !isValidObjectId(videoId as any)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )

    if (!playlist) throw new ApiError(404, "Playlist not found")

    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { playlistId } = req.params
    if (!isValidObjectId(playlistId as any)) throw new ApiError(400, "Invalid playlistId")

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) throw new ApiError(404, "Playlist not found")

    return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { playlistId } = req.params
    const { name, description, isPrivate } = req.body
    if (!isValidObjectId(playlistId as any)) throw new ApiError(400, "Invalid playlistId")
    if (!name || !description) throw new ApiError(400, "Name and description are required")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")

    // @ts-ignore
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    playlist.name = name
    playlist.description = description
    playlist.isPrivate = isPrivate !== undefined ? isPrivate : playlist.isPrivate

    await playlist.save()

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"))
})

const getWatchLater = asyncHandler(async (req: Request, res: Response) => {
    // Check if "Watch Later" playlist exists for user, if not create it
    let watchLater = await Playlist.findOne({
        // @ts-ignore
        owner: req.user?._id,
        name: "Watch Later"
    })

    if (!watchLater) {
        watchLater = await Playlist.create({
            name: "Watch Later",
            description: "Your Watch Later list",
            // @ts-ignore
            owner: req.user?._id
        })
    }

    const playlist = await Playlist.findById(watchLater._id).populate("videos")

    return res.status(200).json(new ApiResponse(200, playlist, "Watch Later fetched successfully"))
})

const toggleWatchLater = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId as string)) throw new ApiError(400, "Invalid video ID")

    let watchLater = await Playlist.findOne({
        // @ts-ignore
        owner: req.user?._id,
        name: "Watch Later"
    })

    if (!watchLater) {
        watchLater = await Playlist.create({
            name: "Watch Later",
            description: "Your Watch Later list",
            // @ts-ignore
            owner: req.user?._id,
            isPrivate: true,
            videos: []
        })
    }

    // @ts-ignore
    const videoObjectId = new mongoose.Types.ObjectId(videoId as string);
    const isAdded = watchLater.videos.some(v => v.equals(videoObjectId));

    if (isAdded) {
        watchLater.videos = watchLater.videos.filter(v => !v.equals(videoObjectId));
        await watchLater.save();
        return res.status(200).json(new ApiResponse(200, { isAdded: false }, "Removed from Watch Later"))
    } else {
        watchLater.videos.push(videoObjectId);
        await watchLater.save();
        return res.status(200).json(new ApiResponse(200, { isAdded: true }, "Added to Watch Later"))
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getWatchLater,
    toggleWatchLater
}
