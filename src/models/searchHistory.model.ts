import mongoose, { Schema, Document } from "mongoose";

export interface ISearchHistory extends Document {
    user: mongoose.Types.ObjectId;
    query: string;
    createdAt: Date;
    updatedAt: Date;
}

const searchHistorySchema = new Schema<ISearchHistory>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        query: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const SearchHistory = mongoose.model<ISearchHistory>("SearchHistory", searchHistorySchema);
