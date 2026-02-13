import mongoose, { Schema, Document } from "mongoose";

export interface IMetric extends Document {
    path: string;
    method: string;
    statusCode: number;
    durationMs: number;
    timestamp: Date;
    ip?: string;
}

const metricSchema = new Schema<IMetric>(
    {
        path: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        statusCode: {
            type: Number,
            required: true
        },
        durationMs: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        ip: {
            type: String
        }
    },
    {
        // No timestamps needed, custom timestamp field used
        versionKey: false
    }
);

// TTL index to auto-delete metrics after 30 days
metricSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export const Metric = mongoose.model<IMetric>("Metric", metricSchema);
