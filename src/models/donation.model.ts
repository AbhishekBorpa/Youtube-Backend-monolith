import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    message?: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    createdAt: Date;
    updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        currency: {
            type: String,
            default: "USD"
        },
        message: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

export const Donation = mongoose.model<IDonation>("Donation", donationSchema);
