export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  arenaTag?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  arenaTag?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
