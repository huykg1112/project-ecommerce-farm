import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

/// Auth interceptor to add JWT token to requests
class AuthInterceptor extends Interceptor {
  final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  AuthInterceptor(this._dio);

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Get access token from secure storage
    final accessToken = await _storage.read(key: AppConstants.keyAccessToken);

    if (accessToken != null && accessToken.isNotEmpty) {
      // Add token to headers
      options.headers['Authorization'] = 'Bearer $accessToken';
    }

    super.onRequest(options, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    // Handle 401 Unauthorized - attempt to refresh token
    if (err.response?.statusCode == 401) {
      // Try to refresh the token
      final refreshed = await _refreshToken();

      if (refreshed) {
        // Retry the request with new token
        try {
          final response = await _retry(err.requestOptions);
          return handler.resolve(response);
        } catch (e) {
          return handler.reject(err);
        }
      } else {
        // Refresh failed - clear tokens and return error
        await _clearTokens();
        return handler.reject(err);
      }
    }

    super.onError(err, handler);
  }

  /// Refresh access token using refresh token
  Future<bool> _refreshToken() async {
    try {
      final refreshToken =
          await _storage.read(key: AppConstants.keyRefreshToken);

      if (refreshToken == null || refreshToken.isEmpty) {
        return false;
      }

      // Call refresh token API
      final response = await _dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
        options: Options(
          headers: {
            'Authorization': 'Bearer $refreshToken',
          },
        ),
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final newAccessToken = data['access_token']; // Backend uses snake_case

        // Save new access token (backend doesn't return new refresh token)
        await _storage.write(
          key: AppConstants.keyAccessToken,
          value: newAccessToken,
        );

        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  /// Retry the failed request
  Future<Response> _retry(RequestOptions requestOptions) async {
    final accessToken = await _storage.read(key: AppConstants.keyAccessToken);

    final options = Options(
      method: requestOptions.method,
      headers: {
        ...requestOptions.headers,
        'Authorization': 'Bearer $accessToken',
      },
    );

    return _dio.request(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }

  /// Clear all tokens from storage
  Future<void> _clearTokens() async {
    await _storage.delete(key: AppConstants.keyAccessToken);
    await _storage.delete(key: AppConstants.keyRefreshToken);
    await _storage.delete(key: AppConstants.keyUserId);
    await _storage.write(key: AppConstants.keyIsLoggedIn, value: 'false');
  }
}
