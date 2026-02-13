import { Report } from "../models/report.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

const createReport = asyncHandler(async (req: Request, res: Response) => {
    const { targetId, targetType, reason } = req.body;

    if (!targetId || !targetType || !reason) {
        throw new ApiError(400, "All fields are required");
    }

    if (!isValidObjectId(targetId as string)) {
        throw new ApiError(400, "Invalid target ID");
    }

    const validTypes = ["Video", "Comment", "Tweet"];
    if (!validTypes.includes(targetType)) {
        throw new ApiError(400, "Invalid target type");
    }

    const report = await Report.create({
        // @ts-ignore
        reporter: req.user?._id,
        targetId,
        targetType,
        reason
    });

    return res.status(201).json(new ApiResponse(201, report, "Report submitted successfully"));
});

const getReports = asyncHandler(async (req: Request, res: Response) => {
    // Only for admin or similar - for now exposing to auth user
    const reports = await Report.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, reports, "Reports fetched successfully"))
})

const updateReportStatus = asyncHandler(async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const { status } = req.body; // RESOLVED or DISMISSED

    if (!["RESOLVED", "DISMISSED"].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const report = await Report.findByIdAndUpdate(
        reportId,
        {
            $set: { status }
        },
        { new: true }
    );

    if (!report) throw new ApiError(404, "Report not found");

    return res.status(200).json(new ApiResponse(200, report, "Report status updated"));
});

const getReportReasons = asyncHandler(async (req: Request, res: Response) => {
    const reasons = [
        "Spam or misleading",
        "Sexual content",
        "Violent or repulsive content",
        "Hateful or abusive content",
        "Harassment or bullying",
        "Harmful or dangerous acts",
        "Child abuse",
        "Promotes terrorism",
        "Infringes my rights",
        "Other issues"
    ];

    return res.status(200).json(new ApiResponse(200, reasons, "Report reasons fetched"));
});

export {
    createReport,
    updateReportStatus,
    getReportReasons
}
