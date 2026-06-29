import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { LoginDto, RegisterDto, UpdatePasswordDto, UpdateProfileDto } from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

interface AdminCreateUserInput {
  email: string;
  password: string;
  role?: "admin" | "user";
  firstName: string;
  lastName: string;
  arenaTag?: string;
}

interface AdminUpdateUserInput {
  email?: string;
  role?: "admin" | "user";
  password?: string;
  firstName?: string;
  lastName?: string;
  arenaTag?: string;
  avatar?: string;
}

class UserService {
  private sanitizeUser(user: any): IUser {
    return {
      _id: String(user._id),
      email: user.email,
      role: user.role,
      person: {
        _id: String(user.person?._id || ""),
        firstName: user.person?.firstName,
        lastName: user.person?.lastName,
        arenaTag: user.person?.arenaTag,
        avatar: user.person?.avatar,
      },
    };
  }

  private generateToken(userId: string, role: "admin" | "user"): string {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: "7d" });
  }

  async register(payload: RegisterDto): Promise<{ user: IUser; token: string }> {
    const existing = await userRepository.findByEmail(payload.email);

    if (existing) {
      throw new HttpException(409, "Email already registered");
    }

    const user = await userRepository.create({
      email: payload.email,
      password: payload.password,
      personData: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        arenaTag: payload.arenaTag,
      },
    });

    const fullUser = await userRepository.findById(String(user._id));

    if (!fullUser) {
      throw new HttpException(500, "Failed to load registered user");
    }

    const token = this.generateToken(String(fullUser._id), fullUser.role);

    return {
      user: this.sanitizeUser(fullUser),
      token,
    };
  }

  async login(payload: LoginDto): Promise<{ user: IUser; token: string }> {
    const user = await userRepository.findByEmailWithPassword(payload.email);

    if (!user) {
      throw new HttpException(401, "Invalid email or password");
    }

    const isMatched = await bcrypt.compare(payload.password, user.password);

    if (!isMatched) {
      throw new HttpException(401, "Invalid email or password");
    }

    const fullUser = await userRepository.findById(String(user._id));

    if (!fullUser) {
      throw new HttpException(500, "Failed to load logged in user");
    }

    const token = this.generateToken(String(fullUser._id), fullUser.role);

    return {
      user: this.sanitizeUser(fullUser),
      token,
    };
  }

  async whoami(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, payload: UpdateProfileDto, avatar?: string): Promise<IUser> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const updated = await userRepository.update(userId, {
      personData: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        arenaTag: payload.arenaTag,
        avatar: avatar || undefined,
      },
    });

    if (!updated) {
      throw new HttpException(500, "Failed to update profile");
    }

    return this.sanitizeUser(updated);
  }

  async updatePassword(userId: string, payload: UpdatePasswordDto): Promise<void> {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isMatched = await bcrypt.compare(payload.currentPassword, user.password);

    if (!isMatched) {
      throw new HttpException(400, "Current password is incorrect");
    }

    await userRepository.update(userId, {
      password: payload.newPassword,
    });
  }

  async getAllUsers(page: number, limit: number): Promise<{ data: IUser[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
    const { data, total } = await userRepository.paginate(page, limit);

    return {
      data: data.map((user) => this.sanitizeUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string): Promise<IUser> {
    return this.whoami(userId);
  }

  async createUser(payload: AdminCreateUserInput): Promise<IUser> {
    const existing = await userRepository.findByEmail(payload.email);

    if (existing) {
      throw new HttpException(409, "Email already registered");
    }

    const created = await userRepository.create({
      email: payload.email,
      password: payload.password,
      role: payload.role || "user",
      personData: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        arenaTag: payload.arenaTag,
      },
    });

    const fullUser = await userRepository.findById(String(created._id));

    if (!fullUser) {
      throw new HttpException(500, "Failed to load created user");
    }

    return this.sanitizeUser(fullUser);
  }

  async updateUser(userId: string, payload: AdminUpdateUserInput): Promise<IUser> {
    const updated = await userRepository.update(userId, {
      email: payload.email,
      role: payload.role,
      password: payload.password,
      personData: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        arenaTag: payload.arenaTag,
        avatar: payload.avatar,
      },
    });

    if (!updated) {
      throw new HttpException(404, "User not found");
    }

    return this.sanitizeUser(updated);
  }

  async deleteUser(userId: string): Promise<void> {
    const isDeleted = await userRepository.delete(userId);

    if (!isDeleted) {
      throw new HttpException(404, "User not found");
    }
  }
}

export const userService = new UserService();
