import '../../../product/domain/entities/product_batch.dart';
import '../../domain/entities/product.dart';

class ProductModel extends Product {
  const ProductModel({
    required super.productId,
    required super.productName,
    super.description,
    super.usageInstructions,
    required super.unitPrice,
    super.originalPrice,
    super.discountPercentage,
    super.totalSaled,
    super.isActive,
    required super.createdAt,
    required super.updatedAt,
    super.imageUrls,
    super.categories,
    super.manufacturerName,
    super.storeName,
    super.storeId,
    super.averageRating,
    super.reviewCount,
    super.batches,
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
        } else if (cat['name'] != null) {
          categories.add(cat['name']);
        }
      }
    }

    // Calculate average rating from reviews
    double? averageRating;
    int? reviewCount;
    if (json['reviews'] != null && json['reviews'] is List) {
      final reviews = json['reviews'] as List;
      // Filter reviews with rating (exclude distributor responses)
      final reviewsWithRating = reviews
          .where((r) => r['rating'] != null && r['parent_review_id'] == null)
          .toList();
      reviewCount = reviewsWithRating.length;
      if (reviewCount > 0) {
        final totalRating = reviewsWithRating.fold<double>(
          0,
          (sum, review) => sum + (review['rating'] ?? 0),
        );
        averageRating = totalRating / reviewCount;
      }
    }

    // Extract store/dealer info from distributor
    String? storeName;
    String? storeId;
    if (json['distributor'] != null) {
      storeId = json['distributor']['user_id'] as String?;
      if (json['distributor']['invenstory'] != null) {
        storeName = json['distributor']['invenstory']['name'] as String?;
      }
    }

    // Parse batches
    final List<ProductBatch> batches = [];
    double? discountPercentage;
    double? originalPrice;
    final unitPrice = (json['unit_product_price'] as num).toDouble();

    if (json['batches'] != null && json['batches'] is List) {
      final batchList = json['batches'] as List;
      for (var batchJson in batchList) {
        if (batchJson['is_active'] == true && batchJson['is_deleted'] != true) {
          // Parse product type
          ProductType? productType;
          if (batchJson['product_types'] != null) {
            final pt = batchJson['product_types'];
            if (pt['is_active'] == true && pt['is_deleted'] != true) {
              productType = ProductType(
                productTypeId: pt['product_type_id'] as String,
                typeName: pt['type_name'] as String? ?? 'Mặc định',
                isActive: true,
              );
            }
          }

          if (productType != null) {
            // Parse expiry date
            DateTime expiryDate;
            try {
              expiryDate = DateTime.parse(batchJson['expiry_date'] as String);
            } catch (_) {
              expiryDate = DateTime.now().add(const Duration(days: 365));
            }

            // Calculate discount from promotions
            double? batchDiscount;
            if (batchJson['promotions'] != null &&
                batchJson['promotions'] is List) {
              final promotions = batchJson['promotions'] as List;
              for (var promo in promotions) {
                if (promo['is_active'] == true && promo['is_deleted'] != true) {
                  final discount =
                      (promo['discount_value'] as num?)?.toDouble();
                  if (discount != null && discount > 0) {
                    if (batchDiscount == null || discount > batchDiscount) {
                      batchDiscount = discount;
                    }
                    // Track max discount for product level
                    if (discountPercentage == null ||
                        discount > discountPercentage) {
                      discountPercentage = discount;
                      originalPrice = unitPrice;
                    }
                  }
                }
              }
            }

            final batchPrice =
                (batchJson['unit_product_price'] as num?)?.toDouble() ??
                    unitPrice;

            batches.add(ProductBatch(
              batchId: batchJson['batch_id'] as String,
              productId: json['product_id'] as String,
              productType: productType,
              unitPrice: batchPrice,
              quantity: batchJson['quantity'] as int? ?? 0,
              expiryDate: expiryDate,
              isActive: true,
              discountPercentage: batchDiscount,
            ));
          }
        }
      }
    }

    // Calculate discounted price
    double finalPrice = unitPrice;
    if (discountPercentage != null && discountPercentage > 0) {
      finalPrice = unitPrice - (unitPrice * discountPercentage / 100);
    }

    return ProductModel(
      productId: json['product_id'] as String,
      productName: json['product_name'] as String,
      description: json['description'] as String?,
      usageInstructions: json['usage_instructions'] as String?,
      unitPrice: finalPrice,
      originalPrice: originalPrice,
      discountPercentage: discountPercentage,
      totalSaled: json['total_saled'] as int? ?? 0,
      isActive: json['is_active'] as bool? ?? true,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      imageUrls: imageUrls,
      categories: categories,
      manufacturerName: json['manufacturer']?['manufacturer_name'] as String?,
      storeName: storeName,
      storeId: storeId,
      averageRating: averageRating,
      reviewCount: reviewCount,
      batches: batches,
    );
  }

  Map<String, dynamic> toJson() => {
        'product_id': productId,
        'product_name': productName,
        'description': description,
        'usage_instructions': usageInstructions,
        'unit_product_price': unitPrice,
        'original_price': originalPrice,
        'discount_percentage': discountPercentage,
        'total_saled': totalSaled,
        'is_active': isActive,
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
        'store_name': storeName,
        'store_id': storeId,
      };

  Product toEntity() => Product(
        productId: productId,
        productName: productName,
        description: description,
        usageInstructions: usageInstructions,
        unitPrice: unitPrice,
        originalPrice: originalPrice,
        discountPercentage: discountPercentage,
        totalSaled: totalSaled,
        isActive: isActive,
        createdAt: createdAt,
        updatedAt: updatedAt,
        imageUrls: imageUrls,
        categories: categories,
        manufacturerName: manufacturerName,
        storeName: storeName,
        storeId: storeId,
        averageRating: averageRating,
        reviewCount: reviewCount,
        batches: batches,
      );
}
