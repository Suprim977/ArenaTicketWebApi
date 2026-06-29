import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SECRET_KEY } from '../configs/constants';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto, UpdateProfileDto } from '../dtos/user.dto';
import { HttpException } from '../exceptions/http-exception';
import User from '../models/user.model';

export class UserService {
  static async register(dto: RegisterDto) {
    const existingEmail = await UserRepository.findByEmail(dto.email);
    if (existingEmail) throw new HttpException(400, 'Email already exists');
    
    const user = await UserRepository.create(dto);
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }

  static async login(dto: LoginDto) {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) throw new HttpException(401, 'Invalid credentials');
    
    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) throw new HttpException(401, 'Invalid credentials');
    
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '7d' });
    const { password, ...safeUser } = user.toObject();
    return { token, user: safeUser };
  }

  static async whoami(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  static async updateProfile(userId: string, dto: UpdateProfileDto, avatarPath?: string) {
    const updates = { ...dto };
    if (avatarPath) updates.avatar = avatarPath;
    
    const user = await UserRepository.update(userId, updates);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  static async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const fullUser = await User.findById(userId);
    if (!fullUser) throw new HttpException(404, 'User not found');
    
    const isMatch = await fullUser.comparePassword(currentPassword);
    if (!isMatch) throw new HttpException(401, 'Current password is incorrect');
    
    await UserRepository.updatePassword(userId, newPassword);
    return true;
  }

  // ADMIN ENDPOINTS
  static async getAllUsers(page: number, limit: number, search?: string) {
    return await UserRepository.findWithPagination(page, limit, search);
  }

  static async getUserById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  static async createUser(dto: RegisterDto) {
    const existingEmail = await UserRepository.findByEmail(dto.email);
    if (existingEmail) throw new HttpException(400, 'Email already exists');
    
    const user = await UserRepository.create(dto);
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }

  static async updateUser(id: string, dto: Partial<UpdateProfileDto>) {
    const user = await UserRepository.update(id, dto);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  static async deleteUser(id: string) {
    const deleted = await UserRepository.delete(id);
    if (!deleted) throw new HttpException(404, 'User not found');
    return true;
  }
}