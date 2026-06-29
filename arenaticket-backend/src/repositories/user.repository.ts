import User from '../models/user.model';
import { RegisterDto, UpdateProfileDto } from '../dtos/user.dto';

export class UserRepository {
  static async findById(id: string) {
    return await User.findById(id).select('-password');
  }

  static async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  static async create(data: RegisterDto) {
    return await User.create(data);
  }

  static async update(id: string, data: Partial<UpdateProfileDto> & { avatar?: string }) {
    return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  static async updatePassword(id: string, password: string) {
    return await User.findByIdAndUpdate(id, { password }, { new: true });
  }

  static async delete(id: string) {
    return await User.findByIdAndDelete(id);
  }

  static async findWithPagination(page: number = 1, limit: number = 10, search?: string) {
    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const total = await User.countDocuments(query);
    const users = await User.find(query).select('-password')
      .skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
      
    return { 
      data: users, 
      meta: { 
        page, 
        limit, 
        total, 
        totalPages: Math.ceil(total / limit) 
      } 
    };
  }
}