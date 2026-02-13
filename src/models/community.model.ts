import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    avatar: string;
    coverImage: string;
    createdAt: Date;
    updatedAt: Date;
}

const communitySchema = new Schema<ICommunity>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        avatar: {
            type: String, // cloudinary url
        },
        coverImage: {
            type: String, // cloudinary url
        },
    },
    {
        timestamps: true,
    }
);

export const Community = mongoose.model<ICommunity>('Community', communitySchema);
