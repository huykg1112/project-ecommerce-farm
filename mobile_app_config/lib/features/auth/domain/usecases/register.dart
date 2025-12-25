import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/token.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

/// Register params
class RegisterParams {
  final String email;
  final String password;
  final String username;
  final String? fullName;
  final String? phoneNumber;

  const RegisterParams({
    required this.email,
    required this.password,
    required this.username,
    this.fullName,
    this.phoneNumber,
  });
}

/// Register use case
@lazySingleton
class Register implements UseCase<({User user, Token token}), RegisterParams> {
  final AuthRepository _repository;

  Register(this._repository);

  @override
  Future<Either<Failure, ({User user, Token token})>> call(
    RegisterParams params,
  ) async {
    return await _repository.register(
      email: params.email,
      password: params.password,
      username: params.username,
      fullName: params.fullName,
      phoneNumber: params.phoneNumber,
    );
  }
}
