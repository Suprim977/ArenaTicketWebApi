import { UserMongoRepository } from '../repositories/user.repository';
import { CreateUserDTOType, LoginUserDTOType } from '../dtos/user.dto';
import { HttpException } from '../exceptions/http-exception';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../configs/constant';

const userRepository = new UserMongoRepository();

export class UserService {
  async createUser(userData: CreateUserDTOType) {
    const existingEmail = await userRepository.getUserByEmail(userData.email);
    if (existingEmail) throw new HttpException(400, 'Email already exists');
    
    const existingUsername = await userRepository.getUserByUsername(userData.username);
    if (existingUsername) throw new HttpException(400, 'Username already exists');

    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const user = await userRepository.createUser({ ...userData, password: hashedPassword });
    
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async loginUser(loginData: LoginUserDTOType) {
    const user = await userRepository.getUserByEmail(loginData.email);
    if (!user) throw new HttpException(401, 'Invalid email or password');

    const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);
    if (!isPasswordValid) throw new HttpException(401, 'Invalid email or password');

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
  }
}
