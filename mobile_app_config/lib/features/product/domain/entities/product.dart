import 'package:equatable/equatable.dart';

import 'product_batch.dart';
import 'product_disease.dart';
import 'product_ingredient.dart';

/// Product entity
class Product extends Equatable {
  final String productId;
  final String productName;
  final String? description;
  final String? usageInstructions;
  final List<ProductIngredient> productIngredients; // Thành phần
  final List<ProductDisease> productDiseases; // Đặc trị bệnh
  final double unitPrice;
  final double? originalPrice; // Price before discount
  final double? discountPercentage; // Discount percentage (0-100)
  final int totalSaled;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> imageUrls;
  final List<String> categories;
  final String? manufacturerName;
  final String? storeName; // Store/Dealer name
  final String? storeId; // Store/Dealer ID
  final double? averageRating;
  final int? reviewCount;
  final List<ProductBatch> batches; // Product batches with types

  const Product({
    required this.productId,
    required this.productName,
    this.description,
    this.usageInstructions,
    this.productIngredients = const [],
    this.productDiseases = const [],
    required this.unitPrice,
    this.originalPrice,
    this.discountPercentage,
    this.totalSaled = 0,
    this.isActive = true,
    required this.createdAt,
    required this.updatedAt,
    this.imageUrls = const [],
    this.categories = const [],
    this.manufacturerName,
    this.storeName,
    this.storeId,
    this.averageRating,
    this.reviewCount,
    this.batches = const [],
  });

  /// Check if product has discount
  bool get hasDiscount => discountPercentage != null && discountPercentage! > 0;

  /// Get display price (discounted or regular)
  double get displayPrice => unitPrice;

  /// Get original price for strikethrough display
  double? get strikethroughPrice => hasDiscount ? originalPrice : null;

  /// Get valid batches (active, in-stock, not expired)
  List<ProductBatch> get validBatches =>
      batches.where((batch) => batch.isValid).toList();

  /// Check if product has any valid batches
  bool get hasValidBatches => validBatches.isNotEmpty;

  /// Get unique product types from batches
  List<ProductType> get productTypes {
    final Map<String, ProductType> uniqueTypes = {};
    for (var batch in validBatches) {
      uniqueTypes[batch.productType.productTypeId] = batch.productType;
    }
    return uniqueTypes.values.toList();
  }

  @override
  List<Object?> get props => [
        productId,
        productName,
        description,
        usageInstructions,
        productIngredients,
        productDiseases,
        unitPrice,
        originalPrice,
        discountPercentage,
        totalSaled,
        isActive,
        createdAt,
        updatedAt,
        imageUrls,
        categories,
        manufacturerName,
        storeName,
        storeId,
        averageRating,
        reviewCount,
        batches,
      ];
}
