import { z } from 'zod';
import { UserSchema } from '../types/user.type';

export const CreateUserDTO = UserSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  username: true,
  password: true,
});
export type CreateUserDTOType = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginUserDTOType = z.infer<typeof LoginUserDTO>;