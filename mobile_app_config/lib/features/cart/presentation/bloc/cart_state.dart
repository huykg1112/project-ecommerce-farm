import 'package:equatable/equatable.dart';
import '../../domain/entities/cart.dart';

/// Cart states
abstract class CartState extends Equatable {
  const CartState();

  @override
  List<Object?> get props => [];
}

/// Cart initial state
class CartInitial extends CartState {
  const CartInitial();
}

/// Cart loading state
class CartLoading extends CartState {
  const CartLoading();
}

/// Cart loaded state
class CartLoaded extends CartState {
  final Cart cart;

  const CartLoaded(this.cart);

  @override
  List<Object?> get props => [cart];
}

/// Cart operation in progress (for add, update, remove)
class CartOperationInProgress extends CartState {
  final Cart cart;

  const CartOperationInProgress(this.cart);

  @override
  List<Object?> get props => [cart];
}

/// Cart error state
class CartError extends CartState {
  final String message;
  final Cart? previousCart;

  const CartError({
    required this.message,
    this.previousCart,
  });

  @override
  List<Object?> get props => [message, previousCart];
}

/// Item added to cart successfully
class CartItemAdded extends CartState {
  final Cart cart;
  final String productName;

  const CartItemAdded({
    required this.cart,
    required this.productName,
  });

  @override
  List<Object?> get props => [cart, productName];
}

/// Cart cleared successfully
class CartCleared extends CartState {
  const CartCleared();
}
