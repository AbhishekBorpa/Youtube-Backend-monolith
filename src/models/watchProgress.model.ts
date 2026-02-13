import mongoose, { Schema, Document } from "mongoose";

export interface IWatchProgress extends Document {
    user: mongoose.Types.ObjectId;
    video: mongoose.Types.ObjectId;
    positionSec: number;
    lastWatched: Date;
    isCompleted: boolean;
}

const watchProgressSchema = new Schema<IWatchProgress>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        positionSec: {
            type: Number,
            required: true,
            default: 0
        },
        lastWatched: {
            type: Date,
            default: Date.now
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Compound index for unique user-video pair
watchProgressSchema.index({ user: 1, video: 1 }, { unique: true });

export const WatchProgress = mongoose.model<IWatchProgress>("WatchProgress", watchProgressSchema);
