import { Document } from "mongoose";

export interface IUserBase {
    name: string;
    email: string;
    password: string;
}

export interface IUserModel extends IUserBase, Document {

}