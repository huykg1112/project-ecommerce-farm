import { User } from '../modules/user/entities/user.entity';

export class UserProfileSerializer {
  static serialize(user: User) {
    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone_number,
      avatar: user.avatar,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      role: user.role.role_name,
      role_id: user.role.role_id,
    };
  }
}
