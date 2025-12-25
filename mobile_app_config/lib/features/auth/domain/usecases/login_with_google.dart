import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/token.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

/// Google Login params
class GoogleLoginParams extends Equatable {
  final String googleIdToken;

  const GoogleLoginParams({
    required this.googleIdToken,
  });

  @override
  List<Object> get props => [googleIdToken];
}

/// Google Login use case
@lazySingleton
class LoginWithGoogle
    implements UseCase<({User user, Token token}), GoogleLoginParams> {
  final AuthRepository _repository;

  LoginWithGoogle(this._repository);

  @override
  Future<Either<Failure, ({User user, Token token})>> call(
    GoogleLoginParams params,
  ) async {
    return await _repository.loginWithGoogle(params.googleIdToken);
  }
}
