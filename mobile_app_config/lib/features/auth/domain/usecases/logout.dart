import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/auth_repository.dart';

/// Logout use case
@lazySingleton
class Logout implements NoParamsUseCase<void> {
  final AuthRepository _repository;

  Logout(this._repository);

  @override
  Future<Either<Failure, void>> call() async {
    return await _repository.logout();
  }
}
