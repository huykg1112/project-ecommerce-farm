import 'package:equatable/equatable.dart';

/// Cart item entity
class CartItem extends Equatable {
  final String cartItemId;
  final String productId;
  final String productName;
  final String? productImage;
  final double unitPrice;
  final int quantity;
  final double subtotal;
  final DateTime createdAt;
  final DateTime updatedAt;

  const CartItem({
    required this.cartItemId,
    required this.productId,
    required this.productName,
    this.productImage,
    required this.unitPrice,
    required this.quantity,
    required this.subtotal,
    required this.createdAt,
    required this.updatedAt,
  });

  /// Create a copy with updated values
  CartItem copyWith({
    String? cartItemId,
    String? productId,
    String? productName,
    String? productImage,
    double? unitPrice,
    int? quantity,
    double? subtotal,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return CartItem(
      cartItemId: cartItemId ?? this.cartItemId,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      productImage: productImage ?? this.productImage,
      unitPrice: unitPrice ?? this.unitPrice,
      quantity: quantity ?? this.quantity,
      subtotal: subtotal ?? this.subtotal,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        cartItemId,
        productId,
        productName,
        productImage,
        unitPrice,
        quantity,
        subtotal,
        createdAt,
        updatedAt,
      ];
}

/// Cart entity containing list of cart items
class Cart extends Equatable {
  final List<CartItem> items;
  final double totalAmount;
  final int itemCount;

  const Cart({
    required this.items,
    required this.totalAmount,
    required this.itemCount,
  });

  /// Empty cart factory
  factory Cart.empty() => const Cart(
        items: [],
        totalAmount: 0,
        itemCount: 0,
      );

  /// Check if cart is empty
  bool get isEmpty => items.isEmpty;

  /// Check if cart is not empty
  bool get isNotEmpty => items.isNotEmpty;

  /// Get total quantity
  int get totalQuantity => items.fold(0, (sum, item) => sum + item.quantity);

  @override
  List<Object?> get props => [items, totalAmount, itemCount];
}
