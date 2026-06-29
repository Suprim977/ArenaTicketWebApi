import { Types } from "mongoose";
import { IPersonDocument, PersonModel } from "../models/person.model";
import { IUserDocument, UserModel } from "../models/user.model";
import { UserRole } from "../types/user.type";

export interface CreateUserInput {
  email: string;
  password: string;
  role?: UserRole;
  personData: {
    firstName: string;
    lastName: string;
    arenaTag?: string;
    avatar?: string;
  };
}

export interface UpdateUserInput {
  email?: string;
  role?: UserRole;
  password?: string;
  personData?: Partial<Pick<IPersonDocument, "firstName" | "lastName" | "arenaTag" | "avatar">>;
}

class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).populate("person");
  }

  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+password").populate("person");
  }

  async create(data: CreateUserInput): Promise<IUserDocument> {
    const person = await PersonModel.create(data.personData);

    return UserModel.create({
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role || "user",
      person: person._id,
    });
  }

  async findById(userId: string): Promise<IUserDocument | null> {
    return UserModel.findById(userId).populate("person");
  }

  async findByIdWithPassword(userId: string): Promise<IUserDocument | null> {
    return UserModel.findById(userId).select("+password").populate("person");
  }

  async paginate(page: number, limit: number): Promise<{ data: IUserDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("person"),
      UserModel.countDocuments(),
    ]);

    return { data, total };
  }

  async update(userId: string, payload: UpdateUserInput): Promise<IUserDocument | null> {
    const user = await UserModel.findById(userId).select(payload.password ? "+password" : "");

    if (!user) {
      return null;
    }

    if (payload.email) {
      user.email = payload.email.toLowerCase();
    }

    if (payload.role) {
      user.role = payload.role;
    }

    if (payload.password) {
      user.password = payload.password;
    }

    await user.save();

    if (payload.personData) {
      await PersonModel.findByIdAndUpdate(user.person as Types.ObjectId, payload.personData, { new: true });
    }

    return this.findById(userId);
  }

  async delete(userId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);

    if (!user) {
      return false;
    }

    await Promise.all([
      UserModel.findByIdAndDelete(userId),
      PersonModel.findByIdAndDelete(user.person as Types.ObjectId),
    ]);

    return true;
  }
}

export const userRepository = new UserRepository();
