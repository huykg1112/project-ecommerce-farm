import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

/// Get current user use case
@lazySingleton
class GetCurrentUser implements NoParamsUseCase<User> {
  final AuthRepository _repository;

  GetCurrentUser(this._repository);

  @override
  Future<Either<Failure, User>> call() async {
    return await _repository.getCurrentUser();
  }
}
