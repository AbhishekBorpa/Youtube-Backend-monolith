import { Donation } from "../models/donation.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

const createDonation = asyncHandler(async (req: Request, res: Response) => {
    const { amount, currency, message, recipientId } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    if (!isValidObjectId(recipientId as string)) {
        throw new ApiError(400, "Invalid recipient ID");
    }

    // @ts-ignore
    if (req.user?._id.toString() === recipientId) {
        throw new ApiError(400, "You cannot donate to yourself");
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) throw new ApiError(404, "Recipient not found");

    // Simulate payment processing (mock)
    const status = "COMPLETED";

    const donation = await Donation.create({
        // @ts-ignore
        sender: req.user?._id,
        recipient: recipientId,
        amount,
        currency: currency || "USD",
        message,
        status
    });

    return res.status(201).json(new ApiResponse(201, donation, "Donation successful"));
});

const getUserDonations = asyncHandler(async (req: Request, res: Response) => {
    // Get donations sent BY the user or RECEIVED by the user? 
    // Let's do received by default if no query param
    const { type = "received" } = req.query; // 'sent' or 'received'

    const filter: any = {};
    // @ts-ignore
    if (type === "sent") filter.sender = req.user?._id;
    // @ts-ignore
    else filter.recipient = req.user?._id;

    const donations = await Donation.find(filter)
        .sort({ createdAt: -1 })
        .populate("sender", "username fullName avatar")
        .populate("recipient", "username fullName avatar");

    return res.status(200).json(new ApiResponse(200, donations, "Donations fetched"));
});

export {
    createDonation,
    getUserDonations
};
