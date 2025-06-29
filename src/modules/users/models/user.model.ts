import mongoose, { Schema } from "mongoose";
import { IUserModel } from "../interfaces/user.model.interface";

export const UserSchema = new Schema<IUserModel>({
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

export const UserModel = mongoose.model<IUserModel>('User', UserSchema);


