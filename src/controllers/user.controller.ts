import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { Session } from "../models/session.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

const generateAccessAndRefreshTokens = async (userId: any, req?: Request) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        if (req) {
            // Save to Session model
            await Session.create({
                user: userId,
                refreshToken,
                ip: req.ip || "0.0.0.0",
                userAgent: req.headers["user-agent"] || "Unknown",
                expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days
            });
        } else {
            // Fallback (should not happen in new flow) or test env
            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })
        }

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => (field as string)?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarLocalPath = files?.avatar?.[0]?.path;
    let coverImageLocalPath;

    if (files && Array.isArray(files.coverImage) && files.coverImage.length > 0) {
        coverImageLocalPath = files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id, req)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (incomingRefreshToken) {
        await Session.findOneAndDelete({ refreshToken: incomingRefreshToken });
    } else {
        // Fallback: clear from user doc if using old system
        await User.findByIdAndUpdate(
            // @ts-ignore
            req.user?._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        )
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        )

        const user = await User.findById((decodedToken as any)?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            // Check Session model
            const session = await Session.findOne({ refreshToken: incomingRefreshToken });
            if (!session) {
                throw new ApiError(401, "Refresh token is expired or used");
            }
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // Invalidate old session
        await Session.findOneAndDelete({ refreshToken: incomingRefreshToken });

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id, req)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body

    // @ts-ignore
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    // @ts-ignore
    user.password = newPassword
    // @ts-ignore
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    return res
        .status(200)
        // @ts-ignore
        .json(new ApiResponse(200, req.user, "User fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, socialLinks } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "Full name and email are required")
    }

    const updateData: any = { fullName, email };
    if (socialLinks) {
        updateData.socialLinks = socialLinks;
    }

    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        req.user?._id,
        {
            $set: updateData
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req: Request, res: Response) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully"))
})

const updateUserCoverImage = asyncHandler(async (req: Request, res: Response) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image")
    }

    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover image updated successfully"))
})

const getUserChannelProfile = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params

    if (!(username as string)?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: (username as string).toLowerCase()
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
                        if: { $in: [(req as any).user?._id, "$subscribers.subscriber"] },
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
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "User channel fetched successfully"))
})

const getWatchHistory = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.aggregate([
        {
            $match: {
                // @ts-ignore
                _id: new mongoose.Types.ObjectId((req as any).user._id)
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
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        )
})

const clearWatchHistory = asyncHandler(async (req: Request, res: Response) => {
    await User.findByIdAndUpdate(
        // @ts-ignore
        req.user?._id,
        {
            $set: {
                watchHistory: []
            }
        },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, {}, "Watch history cleared successfully"))
})

const removeFromWatchHistory = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId as string)) {
        throw new ApiError(400, "Invalid video ID")
    }

    await User.findByIdAndUpdate(
        // @ts-ignore
        req.user?._id,
        {
            $pull: {
                watchHistory: videoId
            }
        },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, {}, "Removed from watch history successfully"))
})

const blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params

    if (!isValidObjectId(userId as string)) {
        throw new ApiError(400, "Invalid user ID")
    }

    // @ts-ignore
    if (req.user?._id.toString() === userId) {
        throw new ApiError(400, "You cannot block yourself")
    }

    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        req.user?._id,
        {
            $addToSet: {
                blockedUsers: userId
            }
        },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, user, "User blocked successfully"))
})

const unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params

    if (!isValidObjectId(userId as string)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        req.user?._id,
        {
            $pull: {
                blockedUsers: userId
            }
        },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, user, "User unblocked successfully"))
})

const getBlockedUsers = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await User.findById(req.user?._id).populate("blockedUsers", "fullName username avatar")

    return res.status(200).json(new ApiResponse(200, user?.blockedUsers, "Blocked users fetched successfully"))
})

const updateUserPreferences = asyncHandler(async (req: Request, res: Response) => {
    const { emailNotifications, pushNotifications, language } = req.body;

    // @ts-ignore
    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) user.preferences.pushNotifications = pushNotifications;
    if (language !== undefined) user.preferences.language = language;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, user.preferences, "Preferences updated"));
});

const getUserPreferences = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user.preferences, "Preferences fetched"));
});

const getUserSessions = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const sessions = await Session.find({ user: req.user?._id }).sort({ lastActive: -1 });
    return res.status(200).json(new ApiResponse(200, sessions, "User sessions fetched"));
});

const revokeSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    // @ts-ignore
    const session = await Session.findOneAndDelete({ _id: sessionId, user: req.user?._id });

    if (!session) throw new ApiError(404, "Session not found");

    return res.status(200).json(new ApiResponse(200, {}, "Session revoked"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    refreshAccessToken,
    changeCurrentPassword,
    clearWatchHistory,
    removeFromWatchHistory,
    blockUser,
    unblockUser,
    getBlockedUsers,
    updateUserPreferences,
    getUserPreferences,
    getUserSessions,
    revokeSession
}
