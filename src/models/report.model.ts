import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
    reporter: mongoose.Types.ObjectId;
    targetType: "Video" | "Comment" | "Tweet";
    targetId: mongoose.Types.ObjectId;
    content: string;
    reason: string;
    status: "PENDING" | "RESOLVED" | "DISMISSED";
    createdAt: Date;
    updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
    {
        reporter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        targetType: {
            type: String,
            required: true,
            enum: ["Video", "Comment", "Tweet"]
        },
        targetId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "targetType"
        },
        content: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING", "RESOLVED", "DISMISSED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
)

export const Report = mongoose.model<IReport>("Report", reportSchema);
