import 'package:equatable/equatable.dart';

/// Product Type entity
class ProductType extends Equatable {
  final String productTypeId;
  final String typeName;
  final bool isActive;

  const ProductType({
    required this.productTypeId,
    required this.typeName,
    this.isActive = true,
  });

  @override
  List<Object?> get props => [productTypeId, typeName, isActive];
}

/// Product Batch entity - represents a lot/batch of products with specific type
class ProductBatch extends Equatable {
  final String batchId;
  final String productId;
  final ProductType productType;
  final double unitPrice;
  final int quantity; // Available stock
  final DateTime expiryDate;
  final bool isActive;
  final double? discountPercentage;

  const ProductBatch({
    required this.batchId,
    required this.productId,
    required this.productType,
    required this.unitPrice,
    required this.quantity,
    required this.expiryDate,
    this.isActive = true,
    this.discountPercentage,
  });

  /// Check if batch has stock available
  bool get hasStock => quantity > 0;

  /// Check if batch is expired
  bool get isExpired => expiryDate.isBefore(DateTime.now());

  /// Check if batch is valid for purchase
  bool get isValid => isActive && hasStock && !isExpired;

  /// Get discounted price
  double get finalPrice {
    if (discountPercentage != null && discountPercentage! > 0) {
      return unitPrice - (unitPrice * discountPercentage! / 100);
    }
    return unitPrice;
  }

  /// Get original price for display
  double? get originalPrice {
    if (discountPercentage != null && discountPercentage! > 0) {
      return unitPrice;
    }
    return null;
  }

  @override
  List<Object?> get props => [
        batchId,
        productId,
        productType,
        unitPrice,
        quantity,
        expiryDate,
        isActive,
        discountPercentage,
      ];
}
