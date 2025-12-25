import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/cart.dart';
import '../repositories/cart_repository.dart';

/// Update cart item use case
@injectable
class UpdateCartItem implements UseCase<Cart, UpdateCartItemParams> {
  final CartRepository _repository;

  UpdateCartItem(this._repository);

  @override
  Future<Either<Failure, Cart>> call(UpdateCartItemParams params) {
    return _repository.updateCartItem(
      cartItemId: params.cartItemId,
      quantity: params.quantity,
    );
  }
}

/// Parameters for update cart item
class UpdateCartItemParams {
  final String cartItemId;
  final int quantity;

  const UpdateCartItemParams({
    required this.cartItemId,
    required this.quantity,
  });
}
