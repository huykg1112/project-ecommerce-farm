import 'package:equatable/equatable.dart';

/// Represents an item in the cart
class CartItem extends Equatable {
  final String id; // Unique cart item id (productId + batchId)
  final String productId;
  final String productName;
  final double price;
  final double? discountValue;
  final int quantity;
  final String imageUrl;
  final String sellerId;
  final String sellerName;
  final String? batchId;

  const CartItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.price,
    this.discountValue,
    required this.quantity,
    required this.imageUrl,
    required this.sellerId,
    required this.sellerName,
    this.batchId,
  });

  /// Get final price after discount
  double get finalPrice => price - (discountValue ?? 0);

  /// Get total price for this item
  double get totalPrice => finalPrice * quantity;

  /// Check if item has discount
  bool get hasDiscount => discountValue != null && discountValue! > 0;

  CartItem copyWith({
    String? id,
    String? productId,
    String? productName,
    double? price,
    double? discountValue,
    int? quantity,
    String? imageUrl,
    String? sellerId,
    String? sellerName,
    String? batchId,
  }) {
    return CartItem(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      price: price ?? this.price,
      discountValue: discountValue ?? this.discountValue,
      quantity: quantity ?? this.quantity,
      imageUrl: imageUrl ?? this.imageUrl,
      sellerId: sellerId ?? this.sellerId,
      sellerName: sellerName ?? this.sellerName,
      batchId: batchId ?? this.batchId,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'productName': productName,
        'price': price,
        'discountValue': discountValue,
        'quantity': quantity,
        'imageUrl': imageUrl,
        'sellerId': sellerId,
        'sellerName': sellerName,
        'batchId': batchId,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'] as String,
      productId: json['productId'] as String,
      productName: json['productName'] as String,
      price: (json['price'] as num).toDouble(),
      discountValue: json['discountValue'] != null
          ? (json['discountValue'] as num).toDouble()
          : null,
      quantity: json['quantity'] as int,
      imageUrl: json['imageUrl'] as String,
      sellerId: json['sellerId'] as String,
      sellerName: json['sellerName'] as String,
      batchId: json['batchId'] as String?,
    );
  }

  @override
  List<Object?> get props => [
        id,
        productId,
        productName,
        price,
        discountValue,
        quantity,
        imageUrl,
        sellerId,
        sellerName,
        batchId,
      ];
}
