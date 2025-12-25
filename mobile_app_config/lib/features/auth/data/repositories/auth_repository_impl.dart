import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/token.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';

/// Auth repository implementation
@LazySingleton(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final AuthLocalDataSource _localDataSource;
  final NetworkInfo _networkInfo;

  AuthRepositoryImpl(
    this._remoteDataSource,
    this._localDataSource,
    this._networkInfo,
  );

  @override
  Future<Either<Failure, ({User user, Token token})>> login({
    required String username,
    required String password,
  }) async {
    try {
      // Check network connectivity
      if (!await _networkInfo.isConnected) {
        return const Left(NetworkFailure());
      }

      // Call remote data source
      final result = await _remoteDataSource.login(
        username: username,
        password: password,
      );

      // Cache user and token
      await _localDataSource.cacheUser(result.user);
      await _localDataSource.cacheToken(result.token);

      // Convert to entities
      return Right((
        user: result.user.toEntity(),
        token: result.token.toEntity(),
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, code: e.code));
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message, code: e.code));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(UnknownFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, ({User user, Token token})>> register({
    required String email,
    required String password,
    required String username,
    String? fullName,
    String? phoneNumber,
  }) async {
    try {
      if (!await _networkInfo.isConnected) {
        return const Left(NetworkFailure());
      }

      final result = await _remoteDataSource.register(
        email: email,
        password: password,
        username: username,
        fullName: fullName,
        phoneNumber: phoneNumber,
      );

      // Cache user and token
      await _localDataSource.cacheUser(result.user);
      await _localDataSource.cacheToken(result.token);

      return Right((
        user: result.user.toEntity(),
        token: result.token.toEntity(),
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, code: e.code));
    } on ValidationException catch (e) {
      return Left(ValidationFailure(
        message: e.message,
        code: e.code,
        errors: e.errors,
      ));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(UnknownFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      // Try to call remote logout (best effort)
      if (await _networkInfo.isConnected) {
        await _remoteDataSource.logout();
      }

      // Clear local data
      await _localDataSource.clearAuthData();

      return const Right(null);
    } catch (e) {
      // Always clear local data even if remote call fails
      await _localDataSource.clearAuthData();
      return const Right(null);
    }
  }

  @override
  Future<Either<Failure, Token>> refreshToken() async {
    try {
      // Get cached refresh token
      final cachedToken = await _localDataSource.getCachedToken();
      if (cachedToken == null) {
        return const Left(AuthFailure(message: 'No refresh token found'));
      }

      if (!await _networkInfo.isConnected) {
        return const Left(NetworkFailure());
      }

      // Call remote data source
      final newToken = await _remoteDataSource.refreshToken(
        cachedToken.refreshToken,
      );

      // Cache new token
      await _localDataSource.cacheToken(newToken);

      return Right(newToken.toEntity());
    } on AuthException catch (e) {
      // Clear auth data if refresh fails
      await _localDataSource.clearAuthData();
      return Left(AuthFailure(message: e.message, code: e.code));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(UnknownFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> getCurrentUser() async {
    try {
      if (!await _networkInfo.isConnected) {
        // Return cached user if no network
        final cachedUser = await _localDataSource.getCachedUser();
        if (cachedUser != null) {
          return Right(cachedUser.toEntity());
        }
        return const Left(NetworkFailure());
      }

      final user = await _remoteDataSource.getCurrentUser();
      await _localDataSource.cacheUser(user);

      return Right(user.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, code: e.code));
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message, code: e.code));
    } catch (e) {
      return Left(UnknownFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> isLoggedIn() async {
    try {
      final isLoggedIn = await _localDataSource.isLoggedIn();
      return Right(isLoggedIn);
    } catch (e) {
      return const Right(false);
    }
  }

  @override
  Future<Either<Failure, ({User user, Token token})>> loginWithGoogle(
    String googleToken,
  ) async {
    try {
      if (!await _networkInfo.isConnected) {
        return const Left(NetworkFailure());
      }

      final result = await _remoteDataSource.loginWithGoogle(googleToken);

      // Cache user and token
      await _localDataSource.cacheUser(result.user);
      await _localDataSource.cacheToken(result.token);

      return Right((
        user: result.user.toEntity(),
        token: result.token.toEntity(),
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, code: e.code));
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message, code: e.code));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(UnknownFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, User?>> getCachedUser() async {
    try {
      final cachedUser = await _localDataSource.getCachedUser();
      return Right(cachedUser?.toEntity());
    } on CacheException catch (e) {
      return Left(CacheFailure(message: e.message));
    } catch (e) {
      return Left(UnknownFailure(message: e.toString()));
    }
  }
}
