export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  address?: string;
  avatar?: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
