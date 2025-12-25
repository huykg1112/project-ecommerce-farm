import '../models/token_model.dart';
import '../models/user_model.dart';

/// Auth remote data source interface
abstract class AuthRemoteDataSource {
  /// Login with email and password
  Future<({UserModel user, TokenModel token})> login({
    required String username,
    required String password,
  });

  /// Register new user
  Future<({UserModel user, TokenModel token})> register({
    required String email,
    required String password,
    required String username,
    String? fullName,
    String? phoneNumber,
  });

  /// Logout
  Future<void> logout();

  /// Refresh access token
  Future<TokenModel> refreshToken(String refreshToken);

  /// Get current user
  Future<UserModel> getCurrentUser();

  /// Login with Google
  Future<({UserModel user, TokenModel token})> loginWithGoogle(
    String googleToken,
  );
}
