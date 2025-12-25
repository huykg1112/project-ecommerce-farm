import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/user.dart';

part 'user_model.g.dart';

/// User model - Data layer
@JsonSerializable(explicitToJson: true, fieldRename: FieldRename.snake)
class UserModel extends User {
  const UserModel({
    required super.userId,
    required super.email,
    required super.username,
    super.fullName,
    super.phoneNumber,
    super.avatar,
    super.avatarPublicId,
    super.cccd,
    required super.isActive,
    required super.isVerified,
    required super.createdAt,
    required super.updatedAt,
    super.roleName,
    super.roleId,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    // Handle backend's mixed naming conventions
    // Some endpoints return 'id', others return 'user_id'
    return UserModel(
      userId: (json['user_id'] ?? json['id']) as String,
      email: json['email'] as String,
      username: json['username'] as String,
      fullName: json['full_name'] as String?,
      phoneNumber: json['phone_number'] as String?,
      avatar: json['avatar'] as String?,
      avatarPublicId:
          json['avatarPublicId'] as String?, // Backend uses camelCase
      cccd: json['cccd'] as String?,
      isActive: json['is_active'] as bool,
      isVerified:
          json['is_verified'] as bool? ?? false, // Default to false if missing
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      roleName: json['role_name'] as String?,
      roleId: json['role_id'] as String?,
    );
  }

  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  factory UserModel.fromEntity(User user) {
    return UserModel(
      userId: user.userId,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      avatarPublicId: user.avatarPublicId,
      cccd: user.cccd,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleName: user.roleName,
      roleId: user.roleId,
    );
  }

  User toEntity() {
    return User(
      userId: userId,
      email: email,
      username: username,
      fullName: fullName,
      phoneNumber: phoneNumber,
      avatar: avatar,
      avatarPublicId: avatarPublicId,
      cccd: cccd,
      isActive: isActive,
      isVerified: isVerified,
      createdAt: createdAt,
      updatedAt: updatedAt,
      roleName: roleName,
      roleId: roleId,
    );
  }
}
