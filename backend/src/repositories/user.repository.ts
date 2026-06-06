import { UserModel, IUser } from '../models/user.model';

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
}

export class UserMongoRepository implements IUserRepository {
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    return await UserModel.create(user);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }
}