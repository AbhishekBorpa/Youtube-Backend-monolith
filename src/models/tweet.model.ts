import mongoose, { Schema, Document } from "mongoose";

export interface ITweet extends Document {
    owner: mongoose.Types.ObjectId;
    content: string;
    image?: string;
    isPoll: boolean;
    pollOptions?: { text: string; votes: number; voters: mongoose.Types.ObjectId[] }[];
    createdAt: Date;
    updatedAt: Date;
}

const tweetSchema = new Schema<ITweet>({
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isPoll: {
        type: Boolean,
        default: false
    },
    pollOptions: [
        {
            text: String,
            votes: { type: Number, default: 0 },
            voters: [{ type: Schema.Types.ObjectId, ref: "User" }]
        }
    ]
}, { timestamps: true })

tweetSchema.index({ content: "text" })

export const Tweet = mongoose.model<ITweet>("Tweet", tweetSchema);
