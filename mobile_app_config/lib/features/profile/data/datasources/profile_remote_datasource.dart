import 'package:dio/dio.dart';

import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/dio_client.dart';
import '../models/update_profile_dto.dart';

/// Profile Remote Data Source
abstract class ProfileRemoteDataSource {
  /// Update user profile
  Future<Map<String, dynamic>> updateProfile(UpdateProfileDto dto);

  /// Upload avatar image
  Future<Map<String, dynamic>> uploadAvatar(String filePath);

  /// Change password
  Future<void> changePassword({
    required String oldPassword,
    required String newPassword,
    required String confirmPassword,
  });
}

/// Implementation of ProfileRemoteDataSource
class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final DioClient _dioClient;

  ProfileRemoteDataSourceImpl(this._dioClient);

  @override
  Future<Map<String, dynamic>> updateProfile(UpdateProfileDto dto) async {
    final Response response = await _dioClient.put(
      ApiConstants.updateProfile,
      data: dto.toJson(),
    );
    return response.data as Map<String, dynamic>;
  }

  @override
  Future<Map<String, dynamic>> uploadAvatar(String filePath) async {
    // Create FormData for file upload
    final formData = FormData.fromMap({
      'image': await MultipartFile.fromFile(filePath),
    });

    final Response response = await _dioClient.post(
      ApiConstants.uploadAvatar,
      data: formData,
    );
    return response.data as Map<String, dynamic>;
  }

  @override
  Future<void> changePassword({
    required String oldPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    await _dioClient.patch(
      ApiConstants.changePassword,
      data: {
        'old_password': oldPassword,
        'new_password': newPassword,
        'confirm_password': confirmPassword,
      },
    );
  }
}
