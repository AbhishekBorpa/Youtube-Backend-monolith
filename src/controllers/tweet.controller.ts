import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model"
import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { uploadOnCloudinary } from "../utils/cloudinary"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { Request, Response } from "express"

const createTweet = asyncHandler(async (req: Request, res: Response) => {
    const { content, isPoll, pollOptions } = req.body
    if (!content) throw new ApiError(400, "Content is required")

    const imageLocalPath = req.file?.path
    let image;
    if (imageLocalPath) {
        image = await uploadOnCloudinary(imageLocalPath)
    }

    const tweetData: any = {
        content,
        image: image?.url || "",
        // @ts-ignore
        owner: req.user?._id,
        isPoll: isPoll || false
    }

    if (isPoll && pollOptions && Array.isArray(pollOptions)) {
        tweetData.pollOptions = pollOptions.map((opt: string) => ({ text: opt, votes: 0, voters: [] }));
    }

    const tweet = await Tweet.create(tweetData)

    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!isValidObjectId(userId as any)) throw new ApiError(400, "Invalid userId")

    const tweets = await Tweet.find({ owner: userId })

    return res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
})

const voteOnTweetPoll = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId, optionIndex } = req.params;

    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweetId");

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new ApiError(404, "Tweet not found");
    if (!tweet.isPoll || !tweet.pollOptions) throw new ApiError(400, "This tweet is not a poll");

    const index = parseInt(optionIndex as string);
    if (index < 0 || index >= tweet.pollOptions.length) throw new ApiError(400, "Invalid option index");

    // Check if user already voted in any option
    // @ts-ignore
    const userId = req.user?._id;
    const hasVoted = tweet.pollOptions.some(opt => opt.voters.includes(userId));

    if (hasVoted) throw new ApiError(400, "You have already voted on this poll");

    tweet.pollOptions[index].votes += 1;
    tweet.pollOptions[index].voters.push(userId);

    await tweet.save();

    return res.status(200).json(new ApiResponse(200, tweet, "Vote recorded successfully"));
});

const updateTweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params
    const { content } = req.body

    const imageLocalPath = req.file?.path

    if (!content && !imageLocalPath) {
        throw new ApiError(400, "Content or image is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) throw new ApiError(404, "Tweet not found")

    // @ts-ignore
    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this tweet")
    }

    const updateData: any = {}
    if (content) updateData.content = content

    if (imageLocalPath) {
        const image = await uploadOnCloudinary(imageLocalPath)
        if (!image.url) throw new ApiError(400, "Error while uploading on image")
        updateData.image = image.url
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: updateData
        },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) throw new ApiError(404, "Tweet not found")

    // @ts-ignore
    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    voteOnTweetPoll
}
