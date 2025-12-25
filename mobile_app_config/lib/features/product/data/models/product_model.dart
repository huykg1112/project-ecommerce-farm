import '../../domain/entities/product.dart';

class ProductModel extends Product {
  const ProductModel({
    required super.productId,
    required super.productName,
    super.description,
    super.usageInstructions,
    required super.unitPrice,
    super.totalSaled,
    super.isActive,
    required super.createdAt,
    required super.updatedAt,
    super.imageUrls,
    super.categories,
    super.manufacturerName,
    super.averageRating,
    super.reviewCount,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    // Extract image URLs from images array
    final List<String> imageUrls = [];
    if (json['images'] != null && json['images'] is List) {
      for (var img in json['images']) {
        if (img['image_url'] != null) {
          imageUrls.add(img['image_url']);
        }
      }
    }

    // Extract category names from categories array
    final List<String> categories = [];
    if (json['categories'] != null && json['categories'] is List) {
      for (var cat in json['categories']) {
        if (cat['category_name'] != null) {
          categories.add(cat['category_name']);
        }
      }
    }

    // Calculate average rating from reviews
    double? averageRating;
    int? reviewCount;
    if (json['reviews'] != null && json['reviews'] is List) {
      final reviews = json['reviews'] as List;
      reviewCount = reviews.length;
      if (reviewCount > 0) {
        final totalRating = reviews.fold<double>(
          0,
          (sum, review) => sum + (review['rating'] ?? 0),
        );
        averageRating = totalRating / reviewCount;
      }
    }

    return ProductModel(
      productId: json['product_id'] as String,
      productName: json['product_name'] as String,
      description: json['description'] as String?,
      usageInstructions: json['usage_instructions'] as String?,
      unitPrice: (json['unit_product_price'] as num).toDouble(),
      totalSaled: json['total_saled'] as int? ?? 0,
      isActive: json['is_active'] as bool? ?? true,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      imageUrls: imageUrls,
      categories: categories,
      manufacturerName: json['manufacturer']?['manufacturer_name'] as String?,
      averageRating: averageRating,
      reviewCount: reviewCount,
    );
  }

  Map<String, dynamic> toJson() => {
        'product_id': productId,
        'product_name': productName,
        'description': description,
        'usage_instructions': usageInstructions,
        'unit_product_price': unitPrice,
        'total_saled': totalSaled,
        'is_active': isActive,
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
      };

  Product toEntity() => Product(
        productId: productId,
        productName: productName,
        description: description,
        usageInstructions: usageInstructions,
        unitPrice: unitPrice,
        totalSaled: totalSaled,
        isActive: isActive,
        createdAt: createdAt,
        updatedAt: updatedAt,
        imageUrls: imageUrls,
        categories: categories,
        manufacturerName: manufacturerName,
        averageRating: averageRating,
        reviewCount: reviewCount,
      );
}
