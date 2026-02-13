import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    targetId: mongoose.Types.ObjectId;
    targetType: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        action: {
            type: String,
            required: true,
            // e.g., 'LIKE_VIDEO', 'SUBSCRIBE', 'COMMENT', 'VIEW_VIDEO'
        },
        targetId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        targetType: {
            type: String,
            required: true
            // e.g., 'Video', 'User', 'Comment'
        },
        metadata: {
            type: Map,
            of: Schema.Types.Mixed
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
