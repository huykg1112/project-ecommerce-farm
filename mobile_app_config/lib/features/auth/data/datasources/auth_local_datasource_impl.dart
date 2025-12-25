import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';
import 'dart:convert';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../models/token_model.dart';
import '../models/user_model.dart';
import 'auth_local_datasource.dart';

/// Auth local data source implementation using Flutter Secure Storage
@LazySingleton(as: AuthLocalDataSource)
class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final FlutterSecureStorage _secureStorage;

  AuthLocalDataSourceImpl(this._secureStorage);

  @override
  Future<UserModel?> getCachedUser() async {
    try {
      final userJson = await _secureStorage.read(key: AppConstants.keyUserData);
      if (userJson != null) {
        return UserModel.fromJson(jsonDecode(userJson));
      }
      return null;
    } catch (e) {
      throw const CacheException(message: 'Failed to get cached user');
    }
  }

  @override
  Future<void> cacheUser(UserModel user) async {
    try {
      final userJson = jsonEncode(user.toJson());
      await _secureStorage.write(
        key: AppConstants.keyUserData,
        value: userJson,
      );
      await _secureStorage.write(
        key: AppConstants.keyUserId,
        value: user.userId,
      );
      await _secureStorage.write(
        key: AppConstants.keyIsLoggedIn,
        value: 'true',
      );
    } catch (e) {
      throw const CacheException(message: 'Failed to cache user');
    }
  }

  @override
  Future<void> deleteCachedUser() async {
    try {
      await _secureStorage.delete(key: AppConstants.keyUserData);
      await _secureStorage.delete(key: AppConstants.keyUserId);
    } catch (e) {
      throw const CacheException(message: 'Failed to delete cached user');
    }
  }

  @override
  Future<TokenModel?> getCachedToken() async {
    try {
      final accessToken =
          await _secureStorage.read(key: AppConstants.keyAccessToken);
      final refreshToken =
          await _secureStorage.read(key: AppConstants.keyRefreshToken);

      if (accessToken != null && refreshToken != null) {
        // For simplicity, we'll create a token with far future expiry
        // In production, you might want to store these separately
        return TokenModel(
          accessToken: accessToken,
          refreshToken: refreshToken,
          accessTokenExpiresAt: DateTime.now().add(const Duration(hours: 1)),
          refreshTokenExpiresAt: DateTime.now().add(const Duration(days: 7)),
        );
      }
      return null;
    } catch (e) {
      throw const CacheException(message: 'Failed to get cached token');
    }
  }

  @override
  Future<void> cacheToken(TokenModel token) async {
    try {
      await _secureStorage.write(
        key: AppConstants.keyAccessToken,
        value: token.accessToken,
      );
      await _secureStorage.write(
        key: AppConstants.keyRefreshToken,
        value: token.refreshToken,
      );
    } catch (e) {
      throw const CacheException(message: 'Failed to cache token');
    }
  }

  @override
  Future<void> deleteCachedToken() async {
    try {
      await _secureStorage.delete(key: AppConstants.keyAccessToken);
      await _secureStorage.delete(key: AppConstants.keyRefreshToken);
    } catch (e) {
      throw const CacheException(message: 'Failed to delete cached token');
    }
  }

  @override
  Future<bool> isLoggedIn() async {
    try {
      final isLoggedIn =
          await _secureStorage.read(key: AppConstants.keyIsLoggedIn);
      return isLoggedIn == 'true';
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> clearAuthData() async {
    try {
      await deleteCachedUser();
      await deleteCachedToken();
      await _secureStorage.write(
        key: AppConstants.keyIsLoggedIn,
        value: 'false',
      );
    } catch (e) {
      throw const CacheException(message: 'Failed to clear auth data');
    }
  }
}
