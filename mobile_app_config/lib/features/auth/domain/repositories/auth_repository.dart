import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/token.dart';
import '../entities/user.dart';

/// Auth repository interface
abstract class AuthRepository {
  /// Login with email and password
  Future<Either<Failure, ({User user, Token token})>> login({
    required String username,
    required String password,
  });

  /// Register new user
  Future<Either<Failure, ({User user, Token token})>> register({
    required String email,
    required String password,
    required String username,
    String? fullName,
    String? phoneNumber,
  });

  /// Logout
  Future<Either<Failure, void>> logout();

  /// Refresh access token
  Future<Either<Failure, Token>> refreshToken();

  /// Get current user
  Future<Either<Failure, User>> getCurrentUser();

  /// Check if user is logged in
  Future<Either<Failure, bool>> isLoggedIn();

  /// Login with Google
  Future<Either<Failure, ({User user, Token token})>> loginWithGoogle(
    String googleToken,
  );

  /// Get cached user
  Future<Either<Failure, User?>> getCachedUser();
}
