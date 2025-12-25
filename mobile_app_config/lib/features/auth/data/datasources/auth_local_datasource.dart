import '../models/token_model.dart';
import '../models/user_model.dart';

/// Auth local data source interface
abstract class AuthLocalDataSource {
  /// Get cached user
  Future<UserModel?> getCachedUser();

  /// Cache user
  Future<void> cacheUser(UserModel user);

  /// Delete cached user
  Future<void> deleteCachedUser();

  /// Get cached token
  Future<TokenModel?> getCachedToken();

  /// Cache token
  Future<void> cacheToken(TokenModel token);

  /// Delete cached token
  Future<void> deleteCachedToken();

  /// Check if user is logged in
  Future<bool> isLoggedIn();

  /// Clear all auth data
  Future<void> clearAuthData();
}
