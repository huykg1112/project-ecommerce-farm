import '../models/cart_model.dart';

/// Cart Remote Data Source Interface
abstract class CartRemoteDataSource {
  /// Get current cart items
  Future<CartModel> getCart();

  /// Add product to cart
  Future<CartModel> addToCart({
    required String productId,
    required int quantity,
  });

  /// Update cart item quantity
  Future<CartModel> updateCartItem({
    required String cartItemId,
    required int quantity,
  });

  /// Remove item from cart
  Future<CartModel> removeFromCart(String cartItemId);

  /// Clear all items from cart
  Future<void> clearCart();

  /// Get cart item count
  Future<int> getCartItemCount();
}
