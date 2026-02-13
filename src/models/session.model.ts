import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
    user: mongoose.Types.ObjectId;
    refreshToken: string; // Hasing this is a good practice, but for MVP storing plain or partial
    ip: string;
    userAgent: string;
    lastActive: Date;
    createdAt: Date;
    expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            default: "0.0.0.0"
        },
        userAgent: {
            type: String,
            default: "Unknown"
        },
        lastActive: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Session = mongoose.model<ISession>("Session", sessionSchema);
