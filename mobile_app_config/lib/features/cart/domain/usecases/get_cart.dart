import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/cart.dart';
import '../repositories/cart_repository.dart';

/// Get cart use case
@injectable
class GetCart implements UseCase<Cart, NoParams> {
  final CartRepository _repository;

  GetCart(this._repository);

  @override
  Future<Either<Failure, Cart>> call(NoParams params) {
    return _repository.getCart();
  }
}
