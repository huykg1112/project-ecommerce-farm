import 'package:equatable/equatable.dart';

/// Cart events
abstract class CartEvent extends Equatable {
  const CartEvent();

  @override
  List<Object?> get props => [];
}

/// Load cart event
class LoadCart extends CartEvent {
  const LoadCart();
}

/// Add to cart event
class AddToCartEvent extends CartEvent {
  final String productId;
  final int quantity;

  const AddToCartEvent({
    required this.productId,
    this.quantity = 1,
  });

  @override
  List<Object?> get props => [productId, quantity];
}

/// Update cart item event
class UpdateCartItemEvent extends CartEvent {
  final String cartItemId;
  final int quantity;

  const UpdateCartItemEvent({
    required this.cartItemId,
    required this.quantity,
  });

  @override
  List<Object?> get props => [cartItemId, quantity];
}

/// Remove from cart event
class RemoveFromCartEvent extends CartEvent {
  final String cartItemId;

  const RemoveFromCartEvent({required this.cartItemId});

  @override
  List<Object?> get props => [cartItemId];
}

/// Clear cart event
class ClearCartEvent extends CartEvent {
  const ClearCartEvent();
}
