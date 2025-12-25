import 'package:equatable/equatable.dart';
import 'exceptions.dart';

/// Base class for all failures in the application
abstract class Failure extends Equatable {
  final String message;
  final int? code;

  const Failure({
    required this.message,
    this.code,
  });

  @override
  List<Object?> get props => [message, code];

  @override
  String toString() => message;
}

/// Server failure (5xx errors)
class ServerFailure extends Failure {
  const ServerFailure({
    super.message = 'Server error occurred. Please try again later.',
    super.code,
  });
}

/// Cache failure (local storage errors)
class CacheFailure extends Failure {
  const CacheFailure({
    super.message = 'Failed to load cached data.',
    super.code,
  });
}

/// Network failure (no internet connection)
class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = 'No internet connection. Please check your network.',
    super.code,
  });
}

/// Authentication failure (401, 403)
class AuthFailure extends Failure {
  const AuthFailure({
    super.message = 'Authentication failed. Please login again.',
    super.code,
  });
}

/// Validation failure (400, validation errors)
class ValidationFailure extends Failure {
  final Map<String, List<String>>? errors;

  const ValidationFailure({
    super.message = 'Validation error.',
    super.code,
    this.errors,
  });

  @override
  List<Object?> get props => [message, code, errors];
}

/// Not found failure (404)
class NotFoundFailure extends Failure {
  const NotFoundFailure({
    super.message = 'Resource not found.',
    super.code,
  });
}

/// Permission failure (403 forbidden)
class PermissionFailure extends Failure {
  const PermissionFailure({
    super.message = 'You do not have permission to perform this action.',
    super.code,
  });
}

/// Timeout failure
class TimeoutFailure extends Failure {
  const TimeoutFailure({
    super.message = 'Request timeout. Please try again.',
    super.code,
  });
}

/// File failure (file operations)
class FileFailure extends Failure {
  const FileFailure({
    super.message = 'File operation failed.',
    super.code,
  });
}

/// Generic failure for unknown errors
class UnknownFailure extends Failure {
  const UnknownFailure({
    super.message = 'An unknown error occurred.',
    super.code,
  });
}

/// Helper function to map exceptions to failures
Failure mapExceptionToFailure(dynamic exception) {
  if (exception is ServerException) {
    return ServerFailure(message: exception.message, code: exception.code);
  } else if (exception is CacheException) {
    return CacheFailure(message: exception.message, code: exception.code);
  } else if (exception is NetworkException) {
    return NetworkFailure(message: exception.message, code: exception.code);
  } else if (exception is AuthException) {
    return AuthFailure(message: exception.message, code: exception.code);
  } else if (exception is ValidationException) {
    return ValidationFailure(
      message: exception.message,
      code: exception.code,
      errors: exception.errors,
    );
  } else if (exception is NotFoundException) {
    return NotFoundFailure(message: exception.message, code: exception.code);
  } else if (exception is PermissionException) {
    return PermissionFailure(message: exception.message, code: exception.code);
  } else if (exception is TimeoutException) {
    return TimeoutFailure(message: exception.message, code: exception.code);
  } else if (exception is FileException) {
    return FileFailure(message: exception.message, code: exception.code);
  } else {
    return UnknownFailure(message: exception.toString());
  }
}
