import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/cart.dart';

/// Cart Repository Interface
abstract class CartRepository {
  /// Get current cart
  Future<Either<Failure, Cart>> getCart();

  /// Add item to cart
  Future<Either<Failure, Cart>> addToCart({
    required String productId,
    required int quantity,
  });

  /// Update cart item quantity
  Future<Either<Failure, Cart>> updateCartItem({
    required String cartItemId,
    required int quantity,
  });

  /// Remove item from cart
  Future<Either<Failure, Cart>> removeFromCart(String cartItemId);

  /// Clear all items from cart
  Future<Either<Failure, void>> clearCart();

  /// Get cart item count
  Future<Either<Failure, int>> getCartItemCount();
}
