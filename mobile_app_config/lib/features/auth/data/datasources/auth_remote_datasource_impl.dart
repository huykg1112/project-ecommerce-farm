import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/network/dio_client.dart';
import '../models/token_model.dart';
import '../models/user_model.dart';
import 'auth_remote_datasource.dart';

/// Auth remote data source implementation using Dio
@LazySingleton(as: AuthRemoteDataSource)
class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final DioClient _dioClient;

  AuthRemoteDataSourceImpl(this._dioClient);

  @override
  Future<({UserModel user, TokenModel token})> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.login,
        data: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data;

        // Backend returns: { access_token, refresh_token, user_id, user: {...} }
        // We need to map this to our models and calculate expiration manually since backend doesn't return it
        final token = TokenModel(
          accessToken: data['access_token'],
          refreshToken: data['refresh_token'],
          accessTokenExpiresAt: DateTime.now().add(const Duration(hours: 5)),
          refreshTokenExpiresAt: DateTime.now().add(const Duration(days: 7)),
        );

        // Parse user data from the 'user' key
        final user = UserModel.fromJson(data['user']);

        return (user: user, token: token);
      } else {
        throw ServerException(
          message: 'Login failed',
          code: response.statusCode,
        );
      }
    } catch (e) {
      if (e is DioException) {
        if (e.response?.statusCode == 401) {
          throw const AuthException(message: 'Invalid credentials');
        }
      }
      rethrow;
    }
  }

  @override
  Future<({UserModel user, TokenModel token})> register({
    required String email,
    required String password,
    required String username,
    String? fullName,
    String? phoneNumber,
  }) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.register,
        data: {
          'email': email,
          'password': password,
          'username': username,
          'full_name': fullName,
          'phone_number': phoneNumber,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Backend returns User object only. We need to auto-login to get the token.
        return await login(username: username, password: password);
        // Note: Backend login uses 'username' field which can be email or username.
        // We pass username here if we want to be safe, or email if login supports it.
        // Looking at backend auth.service.ts: validateUser(username, password) -> findByUsername(username).
        // Wait, backend findByUsername might strictly look for username field.
        // Let's check backend findByUsername implementation again.
        // UserService.findByUsername finds by: { where: { username } }.
        // So we MUST use the 'username' we just registered with to login!
      } else {
        throw ServerException(
          message: 'Registration failed',
          code: response.statusCode,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _dioClient.delete(ApiConstants.logout);
    } catch (e) {
      // Logout failure is not critical
      // Just log and continue
    }
  }

  @override
  Future<TokenModel> refreshToken(String refreshToken) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.refreshToken,
        data: {'refreshToken': refreshToken},
      );

      if (response.statusCode == 200) {
        final data = response.data;
        // Backend only returns { access_token: "..." }
        // We reuse the old refresh token and calculate new expiration
        return TokenModel(
          accessToken: data['access_token'],
          refreshToken: refreshToken, // Reuse the old one
          accessTokenExpiresAt: DateTime.now().add(const Duration(hours: 5)),
          refreshTokenExpiresAt:
              DateTime.now().add(const Duration(days: 7)), // Approximate
        );
      } else {
        throw const AuthException(message: 'Token refresh failed');
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<UserModel> getCurrentUser() async {
    try {
      final response = await _dioClient.get(ApiConstants.getCurrentUser);

      if (response.statusCode == 200) {
        // Backend returns the user profile directly or nested?
        // UserController.getProfile returns UserProfileType.
        return UserModel.fromJson(response.data);
      } else {
        throw const ServerException(message: 'Failed to get current user');
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<({UserModel user, TokenModel token})> loginWithGoogle(
    String googleToken,
  ) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.googleAuth,
        data: {'token': googleToken},
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data;

        final token = TokenModel(
          accessToken: data['access_token'],
          refreshToken: data['refresh_token'],
          accessTokenExpiresAt: DateTime.now().add(const Duration(hours: 5)),
          refreshTokenExpiresAt: DateTime.now().add(const Duration(days: 7)),
        );

        final user = UserModel.fromJson(data['user']);

        return (user: user, token: token);
      } else {
        throw const AuthException(message: 'Google login failed');
      }
    } catch (e) {
      rethrow;
    }
  }
}
