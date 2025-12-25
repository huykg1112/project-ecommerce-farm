import '../../domain/entities/cart.dart';

/// Cart item data model
class CartItemModel extends CartItem {
  const CartItemModel({
    required super.cartItemId,
    required super.productId,
    required super.productName,
    super.productImage,
    required super.unitPrice,
    required super.quantity,
    required super.subtotal,
    required super.createdAt,
    required super.updatedAt,
  });

  /// Factory constructor from JSON
  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    // Handle nested product data if exists
    final product = json['product'] as Map<String, dynamic>?;
    final batchProduct = json['batchProduct'] as Map<String, dynamic>?;

    // Get product info from nested product or batch product
    String productName = 'Sản phẩm';
    String? productImage;
    double unitPrice = 0;

    if (product != null) {
      productName = product['product_name'] as String? ?? 'Sản phẩm';
      final images = product['images'] as List<dynamic>?;
      if (images != null && images.isNotEmpty) {
        productImage = images[0]['image_url'] as String?;
      }
    }

    if (batchProduct != null) {
      unitPrice = (batchProduct['price'] as num?)?.toDouble() ?? 0;
    } else {
      unitPrice = (json['price'] as num?)?.toDouble() ?? 0;
    }

    final quantity = json['quantity'] as int? ?? 1;

    return CartItemModel(
      cartItemId: json['cart_item_id'] as String,
      productId: json['product_id'] as String? ??
          product?['product_id'] as String? ??
          '',
      productName: productName,
      productImage: productImage,
      unitPrice: unitPrice,
      quantity: quantity,
      subtotal: unitPrice * quantity,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : DateTime.now(),
    );
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() => {
        'cart_item_id': cartItemId,
        'product_id': productId,
        'product_name': productName,
        'product_image': productImage,
        'price': unitPrice,
        'quantity': quantity,
        'subtotal': subtotal,
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
      };

  /// Convert to domain entity
  CartItem toEntity() => CartItem(
        cartItemId: cartItemId,
        productId: productId,
        productName: productName,
        productImage: productImage,
        unitPrice: unitPrice,
        quantity: quantity,
        subtotal: subtotal,
        createdAt: createdAt,
        updatedAt: updatedAt,
      );
}

/// Cart data model
class CartModel extends Cart {
  const CartModel({
    required super.items,
    required super.totalAmount,
    required super.itemCount,
  });

  /// Factory constructor from JSON list
  factory CartModel.fromJson(List<dynamic> json) {
    final items = json
        .map((item) => CartItemModel.fromJson(item as Map<String, dynamic>))
        .toList();

    final totalAmount = items.fold<double>(
      0,
      (sum, item) => sum + item.subtotal,
    );

    return CartModel(
      items: items,
      totalAmount: totalAmount,
      itemCount: items.length,
    );
  }

  /// Convert to domain entity
  Cart toEntity() => Cart(
        items: items,
        totalAmount: totalAmount,
        itemCount: itemCount,
      );
}
