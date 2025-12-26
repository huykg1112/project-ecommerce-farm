import 'package:equatable/equatable.dart';

import '../../domain/entities/wishlist_item.dart';

/// Events for WishlistBloc
abstract class WishlistEvent extends Equatable {
  const WishlistEvent();

  @override
  List<Object?> get props => [];
}

/// Load wishlist from storage
class LoadWishlist extends WishlistEvent {
  const LoadWishlist();
}

/// Add item to wishlist
class AddToWishlist extends WishlistEvent {
  final WishlistItem item;

  const AddToWishlist(this.item);

  @override
  List<Object?> get props => [item];
}

/// Remove item from wishlist
class RemoveFromWishlist extends WishlistEvent {
  final String productId;

  const RemoveFromWishlist(this.productId);

  @override
  List<Object?> get props => [productId];
}

/// Toggle item in wishlist (add if not exists, remove if exists)
class ToggleWishlist extends WishlistEvent {
  final WishlistItem item;

  const ToggleWishlist(this.item);

  @override
  List<Object?> get props => [item];
}

/// Clear all items from wishlist
class ClearWishlist extends WishlistEvent {
  const ClearWishlist();
}
