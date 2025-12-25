import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/cart_repository.dart';

/// Clear cart use case
@injectable
class ClearCart implements UseCase<void, NoParams> {
  final CartRepository _repository;

  ClearCart(this._repository);

  @override
  Future<Either<Failure, void>> call(NoParams params) {
    return _repository.clearCart();
  }
}
