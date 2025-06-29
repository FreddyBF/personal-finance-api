import { IUserBase } from './user.model.interface';
import { IUserModel } from './user.model.interface';

export interface IUserRepository {

    findById(id: string): Promise<IUserModel | null>;

    create(user: IUserBase): Promise<IUserModel>;

    update(id: string, user: IUserBase): Promise<IUserModel | null>;

    delete(id: string): Promise<boolean>;

    findByEmail(email: string): Promise<IUserModel | null>;

}