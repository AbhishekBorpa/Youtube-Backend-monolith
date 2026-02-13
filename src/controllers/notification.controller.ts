import { Notification } from "../models/notification.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const getUserNotifications = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user._id

    const notifications = await Notification.find({ recipient: user })
        .sort({ createdAt: -1 })
        .populate("sender", "username avatar fullName")

    return res
        .status(200)
        .json(new ApiResponse(200, notifications, "Notifications fetched successfully"))
})

const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { notificationId } = req.params

    const notification = await Notification.findByIdAndUpdate(
        notificationId,
        {
            $set: {
                isRead: true
            }
        },
        { new: true }
    )

    if (!notification) {
        throw new ApiError(404, "Notification not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notification, "Notification marked as read"))
})

export {
    getUserNotifications,
    markNotificationAsRead
}
