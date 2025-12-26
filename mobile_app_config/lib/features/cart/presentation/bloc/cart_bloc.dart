import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/cart.dart';
import '../../domain/usecases/add_to_cart.dart';
import '../../domain/usecases/clear_cart.dart';
import '../../domain/usecases/get_cart.dart';
import '../../domain/usecases/remove_from_cart.dart';
import '../../domain/usecases/update_cart_item.dart';
import 'cart_event.dart';
import 'cart_state.dart';

/// Cart BLoC
@injectable
class CartBloc extends Bloc<CartEvent, CartState> {
  final GetCart _getCart;
  final AddToCart _addToCart;
  final UpdateCartItem _updateCartItem;
  final RemoveFromCart _removeFromCart;
  final ClearCart _clearCart;

  Cart? _currentCart;

  CartBloc(
    this._getCart,
    this._addToCart,
    this._updateCartItem,
    this._removeFromCart,
    this._clearCart,
  ) : super(const CartInitial()) {
    on<LoadCart>(_onLoadCart);
    on<AddToCartEvent>(_onAddToCart);
    on<UpdateCartItemEvent>(_onUpdateCartItem);
    on<IncrementQuantityEvent>(_onIncrementQuantity);
    on<DecrementQuantityEvent>(_onDecrementQuantity);
    on<RemoveFromCartEvent>(_onRemoveFromCart);
    on<ClearCartEvent>(_onClearCart);
  }

  Future<void> _onLoadCart(
    LoadCart event,
    Emitter<CartState> emit,
  ) async {
    emit(const CartLoading());

    final result = await _getCart(NoParams());

    result.fold(
      (failure) => emit(CartError(message: failure.message)),
      (cart) {
        _currentCart = cart;
        emit(CartLoaded(cart));
      },
    );
  }

  Future<void> _onAddToCart(
    AddToCartEvent event,
    Emitter<CartState> emit,
  ) async {
    if (_currentCart != null) {
      emit(CartOperationInProgress(_currentCart!));
    }

    final result = await _addToCart(AddToCartParams(
      productId: event.item.productId,
      quantity: event.item.quantity,
    ));

    result.fold(
      (failure) => emit(CartError(
        message: failure.message,
        previousCart: _currentCart,
      )),
      (cart) {
        _currentCart = cart;
        emit(CartItemAdded(
          cart: cart,
          productName: 'Sản phẩm', // TODO: Get actual name
        ));
        // Emit loaded state after a short delay
        emit(CartLoaded(cart));
      },
    );
  }

  Future<void> _onUpdateCartItem(
    UpdateCartItemEvent event,
    Emitter<CartState> emit,
  ) async {
    if (_currentCart != null) {
      emit(CartOperationInProgress(_currentCart!));
    }

    final result = await _updateCartItem(UpdateCartItemParams(
      cartItemId: event.cartItemId,
      quantity: event.quantity,
    ));

    result.fold(
      (failure) => emit(CartError(
        message: failure.message,
        previousCart: _currentCart,
      )),
      (cart) {
        _currentCart = cart;
        emit(CartLoaded(cart));
      },
    );
  }

  Future<void> _onIncrementQuantity(
    IncrementQuantityEvent event,
    Emitter<CartState> emit,
  ) async {
    if (_currentCart == null) return;

    final item = _currentCart!.items.firstWhere(
      (item) => item.cartItemId == event.cartItemId,
      orElse: () => throw Exception('Item not found'),
    );

    add(UpdateCartItemEvent(
      cartItemId: event.cartItemId,
      quantity: item.quantity + 1,
    ));
  }

  Future<void> _onDecrementQuantity(
    DecrementQuantityEvent event,
    Emitter<CartState> emit,
  ) async {
    if (_currentCart == null) return;

    final item = _currentCart!.items.firstWhere(
      (item) => item.cartItemId == event.cartItemId,
      orElse: () => throw Exception('Item not found'),
    );

    if (item.quantity > 1) {
      add(UpdateCartItemEvent(
        cartItemId: event.cartItemId,
        quantity: item.quantity - 1,
      ));
    } else {
      add(RemoveFromCartEvent(event.cartItemId));
    }
  }

  Future<void> _onRemoveFromCart(
    RemoveFromCartEvent event,
    Emitter<CartState> emit,
  ) async {
    if (_currentCart != null) {
      emit(CartOperationInProgress(_currentCart!));
    }

    final result = await _removeFromCart(RemoveFromCartParams(
      cartItemId: event.cartItemId,
    ));

    result.fold(
      (failure) => emit(CartError(
        message: failure.message,
        previousCart: _currentCart,
      )),
      (cart) {
        _currentCart = cart;
        emit(CartLoaded(cart));
      },
    );
  }

  Future<void> _onClearCart(
    ClearCartEvent event,
    Emitter<CartState> emit,
  ) async {
    if (_currentCart != null) {
      emit(CartOperationInProgress(_currentCart!));
    }

    final result = await _clearCart(NoParams());

    result.fold(
      (failure) => emit(CartError(
        message: failure.message,
        previousCart: _currentCart,
      )),
      (_) {
        _currentCart = Cart.empty();
        emit(const CartCleared());
        emit(CartLoaded(Cart.empty()));
      },
    );
  }
}
