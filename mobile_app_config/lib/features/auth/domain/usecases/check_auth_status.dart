import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/auth_repository.dart';

/// Check auth status use case
@lazySingleton
class CheckAuthStatus implements NoParamsUseCase<bool> {
  final AuthRepository _repository;

  CheckAuthStatus(this._repository);

  @override
  Future<Either<Failure, bool>> call() async {
    return await _repository.isLoggedIn();
  }
}
