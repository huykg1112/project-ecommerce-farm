/// Base class for all exceptions in the application
class AppException implements Exception {
  final String message;
  final int? code;

  const AppException({
    required this.message,
    this.code,
  });

  @override
  String toString() => 'AppException: $message (code: $code)';
}

/// Server exception (5xx errors)
class ServerException extends AppException {
  const ServerException({
    super.message = 'Server error occurred',
    super.code,
  });
}

/// Cache exception (local storage errors)
class CacheException extends AppException {
  const CacheException({
    super.message = 'Cache error occurred',
    super.code,
  });
}

/// Network exception (no internet)
class NetworkException extends AppException {
  const NetworkException({
    super.message = 'No internet connection',
    super.code,
  });
}

/// Authentication exception (401, 403)
class AuthException extends AppException {
  const AuthException({
    super.message = 'Authentication failed',
    super.code,
  });
}

/// Validation exception (400)
class ValidationException extends AppException {
  final Map<String, List<String>>? errors;

  const ValidationException({
    super.message = 'Validation failed',
    super.code,
    this.errors,
  });

  @override
  String toString() {
    if (errors != null && errors!.isNotEmpty) {
      final errorMessages = errors!.entries
          .map((e) => '${e.key}: ${e.value.join(", ")}')
          .join('\n');
      return 'ValidationException: $message\n$errorMessages';
    }
    return super.toString();
  }
}

/// Not found exception (404)
class NotFoundException extends AppException {
  const NotFoundException({
    super.message = 'Resource not found',
    super.code = 404,
  });
}

/// Permission exception (403)
class PermissionException extends AppException {
  const PermissionException({
    super.message = 'Permission denied',
    super.code = 403,
  });
}

/// Timeout exception
class TimeoutException extends AppException {
  const TimeoutException({
    super.message = 'Request timeout',
    super.code,
  });
}

/// File exception
class FileException extends AppException {
  const FileException({
    super.message = 'File operation failed',
    super.code,
  });
}

/// JSON parsing exception
class JsonParsingException extends AppException {
  const JsonParsingException({
    super.message = 'Failed to parse JSON',
    super.code,
  });
}

/// Database exception
class DatabaseException extends AppException {
  const DatabaseException({
    super.message = 'Database error occurred',
    super.code,
  });
}
