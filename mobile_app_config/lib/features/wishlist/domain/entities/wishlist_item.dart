import 'package:equatable/equatable.dart';

/// Represents an item in the wishlist
class WishlistItem extends Equatable {
  final String productId;
  final String productName;
  final double price;
  final double? originalPrice;
  final double? discountPercentage;
  final String? imageUrl;
  final String? storeName;
  final double? rating;
  final DateTime addedAt;

  const WishlistItem({
    required this.productId,
    required this.productName,
    required this.price,
    this.originalPrice,
    this.discountPercentage,
    this.imageUrl,
    this.storeName,
    this.rating,
    required this.addedAt,
  });

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'productName': productName,
        'price': price,
        'originalPrice': originalPrice,
        'discountPercentage': discountPercentage,
        'imageUrl': imageUrl,
        'storeName': storeName,
        'rating': rating,
        'addedAt': addedAt.toIso8601String(),
      };

  factory WishlistItem.fromJson(Map<String, dynamic> json) {
    return WishlistItem(
      productId: json['productId'] as String,
      productName: json['productName'] as String,
      price: (json['price'] as num).toDouble(),
      originalPrice: json['originalPrice'] != null
          ? (json['originalPrice'] as num).toDouble()
          : null,
      discountPercentage: json['discountPercentage'] != null
          ? (json['discountPercentage'] as num).toDouble()
          : null,
      imageUrl: json['imageUrl'] as String?,
      storeName: json['storeName'] as String?,
      rating:
          json['rating'] != null ? (json['rating'] as num).toDouble() : null,
      addedAt: DateTime.parse(json['addedAt'] as String),
    );
  }

  @override
  List<Object?> get props => [
        productId,
        productName,
        price,
        originalPrice,
        discountPercentage,
        imageUrl,
        storeName,
        rating,
        addedAt,
      ];
}
