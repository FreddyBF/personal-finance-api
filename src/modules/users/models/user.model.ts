import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.model.interface";

export const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);


