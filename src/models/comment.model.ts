import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IComment extends Document {
    content: string;
    video: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId;
    ownerHearted: boolean;
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        ownerHearted: {
            type: Boolean,
            default: false
        },
        isPinned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model<IComment, mongoose.AggregatePaginateModel<IComment>>("Comment", commentSchema);
