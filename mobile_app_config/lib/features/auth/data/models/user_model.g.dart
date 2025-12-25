// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserModel _$UserModelFromJson(Map<String, dynamic> json) => UserModel(
      userId: json['user_id'] as String,
      email: json['email'] as String,
      username: json['username'] as String,
      fullName: json['full_name'] as String?,
      phoneNumber: json['phone_number'] as String?,
      avatar: json['avatar'] as String?,
      avatarPublicId: json['avatar_public_id'] as String?,
      cccd: json['cccd'] as String?,
      isActive: json['is_active'] as bool,
      isVerified: json['is_verified'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      roleName: json['role_name'] as String?,
      roleId: json['role_id'] as String?,
    );

Map<String, dynamic> _$UserModelToJson(UserModel instance) => <String, dynamic>{
      'user_id': instance.userId,
      'email': instance.email,
      'username': instance.username,
      'full_name': instance.fullName,
      'phone_number': instance.phoneNumber,
      'avatar': instance.avatar,
      'avatar_public_id': instance.avatarPublicId,
      'cccd': instance.cccd,
      'is_active': instance.isActive,
      'is_verified': instance.isVerified,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
      'role_name': instance.roleName,
      'role_id': instance.roleId,
    };
