import { User } from '../entities/user.entity';

export class UserProfileSerializer {
  static serialize(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      lat: user.lat,
      lng: user.lng,
      avatar: user.avatar,
      isVerified: user.isVerified,
      roleId: user.role.id,
      roleName: user.role.name,
      roleDescription: user.role.description,
    };
  }
}
