import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVideo extends Document {
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    tags: string[];
    category: string;
    type: "video" | "short";
    pinnedComment?: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    publishAt?: Date;
    chapters: { title: string; start: number }[];
    createdAt: Date;
    updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
    {
        videoFile: {
            type: String, // cloudinary url
            required: true
        },
        thumbnail: {
            type: String, // cloudinary url
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        tags: [
            {
                type: String
            }
        ],
        category: {
            type: String,
            default: "General"
        },
        type: {
            type: String,
            enum: ["video", "short"],
            default: "video"
        },
        pinnedComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        publishAt: {
            type: Date
        },
        chapters: [
            {
                title: { type: String, required: true },
                start: { type: Number, required: true } // seconds
            }
        ]
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate);

videoSchema.index({ title: "text", description: "text" });

export const Video = mongoose.model<IVideo, mongoose.AggregatePaginateModel<IVideo>>("Video", videoSchema);
