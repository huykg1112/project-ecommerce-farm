import { User } from '../modules/user/entities/user.entity';
import {
  AddressType,
  UserProfileType,
} from './TypeSerializer/UserProfile.type';

export class UserProfileSerializer {
  static serialize(user: User): UserProfileType {
    // Chỉ lấy các địa chỉ còn hoạt động
    let addresses = Array.isArray(user.addresses)
      ? user.addresses.filter((addr) => addr.is_active)
      : [];
    addresses.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
    // Map addresses to required fields
    const addressList: AddressType[] = addresses.map((address) => ({
      address_id: address.address_id,
      address_detail: address.address_detail,
      latitude: address.latitude,
      longitude: address.longitude,
      is_default: address.is_default,
      is_active: address.is_active,
      created_at: address.created_at,
      updated_at: address.updated_at,
    }));
    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      cccd: user.cccd,
      // license_number: user.license,
      avatar: user.avatar,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      role_id: user.role?.role_id,
      role_name: user.role?.role_name,
      addresses: addressList,
    };
  }
}
