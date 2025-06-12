import { IUserRepository } from "../interfaces/user.repository.interface";
import { User } from "../models/user.model";
import { CreateUserDTO } from "../dtos/create-user.dto";

export class UserRepository implements IUserRepository {

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    async create(userData: CreateUserDTO): Promise<IUser> {
        const newUser = new User(userData);
        return await newUser.save();
    }

    async update(id: string, user: CreateUserDTO): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, user, { new: true });
    }
    
    async delete(id: string): Promise<boolean> {
        const result = await User.findByIdAndDelete(id);
        return result !== null;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async findAll(): Promise<IUser[]> {
        return await User.find();
    }
        
}