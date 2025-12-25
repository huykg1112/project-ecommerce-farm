import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/cart.dart';
import '../repositories/cart_repository.dart';

/// Add to cart use case
@injectable
class AddToCart implements UseCase<Cart, AddToCartParams> {
  final CartRepository _repository;

  AddToCart(this._repository);

  @override
  Future<Either<Failure, Cart>> call(AddToCartParams params) {
    return _repository.addToCart(
      productId: params.productId,
      quantity: params.quantity,
    );
  }
}

/// Parameters for add to cart
class AddToCartParams {
  final String productId;
  final int quantity;

  const AddToCartParams({
    required this.productId,
    this.quantity = 1,
  });
}
