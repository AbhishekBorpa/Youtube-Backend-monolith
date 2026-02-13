import mongoose, { isValidObjectId } from "mongoose";
import { Community } from "../models/community.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Request, Response } from "express";

const createCommunity = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const existedCommunity = await Community.findOne({ name });
    if (existedCommunity) {
        throw new ApiError(409, "Community with this name already exists");
    }

    const avatarLocalPath = (req.files as any)?.avatar?.[0]?.path;
    const coverImageLocalPath = (req.files as any)?.coverImage?.[0]?.path;

    let avatar;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    }

    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    const community = await Community.create({
        name,
        description,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        // @ts-ignore
        owner: req.user?._id,
        // @ts-ignore
        members: [req.user?._id]
    });

    return res.status(201).json(
        new ApiResponse(201, community, "Community created successfully")
    );
});

const getCommunityDetails = asyncHandler(async (req: Request, res: Response) => {
    const { communityId } = req.params;

    if (!isValidObjectId(communityId)) {
        throw new ApiError(400, "Invalid communityId");
    }

    const community = await Community.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(communityId as string)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                membersCount: { $size: "$members" }
            }
        }
    ]);

    if (!community?.length) {
        throw new ApiError(404, "Community not found");
    }

    return res.status(200).json(
        new ApiResponse(200, community[0], "Community details fetched successfully")
    );
});

const joinCommunity = asyncHandler(async (req: Request, res: Response) => {
    const { communityId } = req.params;

    if (!isValidObjectId(communityId)) {
        throw new ApiError(400, "Invalid communityId");
    }

    const community = await Community.findById(communityId);
    if (!community) {
        throw new ApiError(404, "Community not found");
    }

    // @ts-ignore
    const userId = req.user?._id;

    if (community.members.includes(userId)) {
        throw new ApiError(400, "You are already a member of this community");
    }

    community.members.push(userId);
    await community.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Joined community successfully")
    );
});

const leaveCommunity = asyncHandler(async (req: Request, res: Response) => {
    const { communityId } = req.params;

    if (!isValidObjectId(communityId)) {
        throw new ApiError(400, "Invalid communityId");
    }

    const community = await Community.findById(communityId);
    if (!community) {
        throw new ApiError(404, "Community not found");
    }

    // @ts-ignore
    const userId = req.user?._id;

    if (community.owner.toString() === userId.toString()) {
        throw new ApiError(400, "Owner cannot leave the community. Delete it instead.");
    }

    if (!community.members.includes(userId)) {
        throw new ApiError(400, "You are not a member of this community");
    }

    community.members = community.members.filter(id => id.toString() !== userId.toString());
    await community.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Left community successfully")
    );
});

const updateCommunity = asyncHandler(async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(communityId)) {
        throw new ApiError(400, "Invalid communityId");
    }

    const community = await Community.findById(communityId);
    if (!community) {
        throw new ApiError(404, "Community not found");
    }

    // @ts-ignore
    if (community.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only the owner can update community details");
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const avatarLocalPath = (req.files as any)?.avatar?.[0]?.path;
    const coverImageLocalPath = (req.files as any)?.coverImage?.[0]?.path;

    if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (avatar) updateData.avatar = avatar.url;
    }

    if (coverImageLocalPath) {
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (coverImage) updateData.coverImage = coverImage.url;
    }

    const updatedCommunity = await Community.findByIdAndUpdate(
        communityId,
        { $set: updateData },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedCommunity, "Community updated successfully")
    );
});

export {
    createCommunity,
    getCommunityDetails,
    joinCommunity,
    leaveCommunity,
    updateCommunity
};
