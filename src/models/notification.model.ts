import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    type: "SUBSCRIBE" | "COMMENT" | "LIKE" | "TWEET";
    relatedId?: mongoose.Types.ObjectId; // VideoId, CommentId, TweetId etc.
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        type: {
            type: String,
            enum: ["SUBSCRIBE", "COMMENT", "LIKE", "TWEET"],
            required: true
        },
        relatedId: {
            type: Schema.Types.ObjectId
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
