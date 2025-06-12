import { IUser } from '../models/user.model';
import { CreateUserDTO } from '../dtos/create-user.dto';

export interface IUserRepository {
    findById(id: string): Promise<IUser | null>;
    create(user: CreateUserDTO): Promise<IUser>;
    update(id: string, user: CreateUserDTO): Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
    findByEmail(email: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;

}