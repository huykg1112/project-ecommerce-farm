import 'package:equatable/equatable.dart';

/// User entity - Domain layer
class User extends Equatable {
  final String userId;
  final String email;
  final String username;
  final String? fullName;
  final String? phoneNumber;
  final String? avatar;
  final String? avatarPublicId;
  final String? cccd;
  final bool isActive;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? roleName;
  final String? roleId;

  const User({
    required this.userId,
    required this.email,
    required this.username,
    this.fullName,
    this.phoneNumber,
    this.avatar,
    this.avatarPublicId,
    this.cccd,
    required this.isActive,
    required this.isVerified,
    required this.createdAt,
    required this.updatedAt,
    this.roleName,
    this.roleId,
  });

  @override
  List<Object?> get props => [
        userId,
        email,
        username,
        fullName,
        phoneNumber,
        avatar,
        avatarPublicId,
        cccd,
        isActive,
        isVerified,
        createdAt,
        updatedAt,
        roleName,
        roleId,
      ];

  User copyWith({
    String? userId,
    String? email,
    String? username,
    String? fullName,
    String? phoneNumber,
    String? avatar,
    String? avatarPublicId,
    String? cccd,
    bool? isActive,
    bool? isVerified,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? roleName,
    String? roleId,
  }) {
    return User(
      userId: userId ?? this.userId,
      email: email ?? this.email,
      username: username ?? this.username,
      fullName: fullName ?? this.fullName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      avatar: avatar ?? this.avatar,
      avatarPublicId: avatarPublicId ?? this.avatarPublicId,
      cccd: cccd ?? this.cccd,
      isActive: isActive ?? this.isActive,
      isVerified: isVerified ?? this.isVerified,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      roleName: roleName ?? this.roleName,
      roleId: roleId ?? this.roleId,
    );
  }
}
