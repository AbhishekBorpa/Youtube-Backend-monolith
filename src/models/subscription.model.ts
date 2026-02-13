import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
    subscriber: mongoose.Types.ObjectId; // one who is subscribing
    channel: mongoose.Types.ObjectId; // one to whom 'subscriber' is subscribing
    notifications: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    notifications: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
