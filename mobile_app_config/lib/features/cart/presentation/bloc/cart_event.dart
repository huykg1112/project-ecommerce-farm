import 'package:equatable/equatable.dart';

import '../../domain/entities/cart_item.dart';

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

/// Add to cart event with full CartItem
class AddToCartEvent extends CartEvent {
  final CartItem item;

  const AddToCartEvent(this.item);

  @override
  List<Object?> get props => [item];
}

/// Update cart item quantity event
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

/// Increment item quantity
class IncrementQuantityEvent extends CartEvent {
  final String cartItemId;

  const IncrementQuantityEvent(this.cartItemId);

  @override
  List<Object?> get props => [cartItemId];
}

/// Decrement item quantity
class DecrementQuantityEvent extends CartEvent {
  final String cartItemId;

  const DecrementQuantityEvent(this.cartItemId);

  @override
  List<Object?> get props => [cartItemId];
}

/// Remove from cart event
class RemoveFromCartEvent extends CartEvent {
  final String cartItemId;

  const RemoveFromCartEvent(this.cartItemId);

  @override
  List<Object?> get props => [cartItemId];
}

/// Clear cart event
class ClearCartEvent extends CartEvent {
  const ClearCartEvent();
}
