import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/cart.dart';
import '../repositories/cart_repository.dart';

/// Remove from cart use case
@injectable
class RemoveFromCart implements UseCase<Cart, RemoveFromCartParams> {
  final CartRepository _repository;

  RemoveFromCart(this._repository);

  @override
  Future<Either<Failure, Cart>> call(RemoveFromCartParams params) {
    return _repository.removeFromCart(params.cartItemId);
  }
}

/// Parameters for remove from cart
class RemoveFromCartParams {
  final String cartItemId;

  const RemoveFromCartParams({required this.cartItemId});
}
