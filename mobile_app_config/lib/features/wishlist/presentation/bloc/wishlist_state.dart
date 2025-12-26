import 'package:equatable/equatable.dart';

import '../../domain/entities/wishlist_item.dart';

/// States for WishlistBloc
abstract class WishlistState extends Equatable {
  const WishlistState();

  @override
  List<Object?> get props => [];
}

/// Initial state
class WishlistInitial extends WishlistState {
  const WishlistInitial();
}

/// Wishlist loading
class WishlistLoading extends WishlistState {
  const WishlistLoading();
}

/// Wishlist loaded with items
class WishlistLoaded extends WishlistState {
  final List<WishlistItem> items;

  const WishlistLoaded(this.items);

  int get totalItems => items.length;

  bool isInWishlist(String productId) {
    return items.any((item) => item.productId == productId);
  }

  @override
  List<Object?> get props => [items];
}

/// Wishlist error
class WishlistError extends WishlistState {
  final String message;

  const WishlistError(this.message);

  @override
  List<Object?> get props => [message];
}
