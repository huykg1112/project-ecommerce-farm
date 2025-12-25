import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/token.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

/// Login params
class LoginParams extends Equatable {
  final String username;
  final String password;

  const LoginParams({
    required this.username,
    required this.password,
  });

  @override
  List<Object> get props => [username, password];
}

/// Login use case
@lazySingleton
class Login implements UseCase<({User user, Token token}), LoginParams> {
  final AuthRepository _repository;

  Login(this._repository);

  @override
  Future<Either<Failure, ({User user, Token token})>> call(
    LoginParams params,
  ) async {
    return await _repository.login(
      username: params.username,
      password: params.password,
    );
  }
}
