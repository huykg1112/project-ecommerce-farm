import '../../../product/domain/entities/product_batch.dart';
import '../../domain/entities/product.dart';
import '../../domain/entities/product_disease.dart';
import '../../domain/entities/product_ingredient.dart';

class ProductModel extends Product {
  const ProductModel({
    required super.productId,
    required super.productName,
    super.description,
    super.usageInstructions,
    super.productIngredients,
    super.productDiseases,
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

    // Parse product ingredients
    final List<ProductIngredient> productIngredients = [];
    if (json['product_ingredients'] != null &&
        json['product_ingredients'] is List) {
      for (var piJson in json['product_ingredients'] as List) {
        final ingredientJson = piJson['ingredient'];
        if (ingredientJson != null) {
          productIngredients.add(ProductIngredient(
            productIngredientId:
                piJson['product_ingredient_id'] as String? ?? '',
            ingredient: Ingredient(
              ingredientId: ingredientJson['ingredient_id'] as String? ?? '',
              ingredientName:
                  ingredientJson['ingredient_name'] as String? ?? '',
              description: ingredientJson['description'] as String?,
            ),
            isPrimary: piJson['is_primary'] as bool? ?? false,
          ));
        }
      }
    }
    // Sort: primary ingredients first
    productIngredients
        .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

    // Parse product diseases (API returns 'productDiseases' in camelCase)
    final List<ProductDisease> productDiseases = [];
    final diseasesData = json['productDiseases'] ?? json['product_diseases'];
    if (diseasesData != null && diseasesData is List) {
      for (var pdJson in diseasesData as List) {
        final diseaseJson = pdJson['disease'];
        if (diseaseJson != null) {
          productDiseases.add(ProductDisease(
            productDiseaseId: pdJson['product_disease_id'] as String? ?? '',
            disease: Disease(
              diseaseId: diseaseJson['disease_id'] as String? ?? '',
              diseaseName: diseaseJson['disease_name'] as String? ?? '',
              description: diseaseJson['description'] as String?,
            ),
            isPrimary: pdJson['is_primary'] as bool? ?? false,
          ));
        }
      }
    }
    // Sort: primary diseases first
    productDiseases
        .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

    return ProductModel(
      productId: json['product_id'] as String,
      productName: json['product_name'] as String,
      description: json['description'] as String?,
      usageInstructions: json['usage_instructions'] as String?,
      productIngredients: productIngredients,
      productDiseases: productDiseases,
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
        'product_ingredients': productIngredients
            .map((pi) => {
                  'product_ingredient_id': pi.productIngredientId,
                  'is_primary': pi.isPrimary,
                  'ingredient': {
                    'ingredient_id': pi.ingredient.ingredientId,
                    'ingredient_name': pi.ingredient.ingredientName,
                    'description': pi.ingredient.description,
                  },
                })
            .toList(),
        'product_diseases': productDiseases
            .map((pd) => {
                  'product_disease_id': pd.productDiseaseId,
                  'is_primary': pd.isPrimary,
                  'disease': {
                    'disease_id': pd.disease.diseaseId,
                    'disease_name': pd.disease.diseaseName,
                    'description': pd.disease.description,
                  },
                })
            .toList(),
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
        productIngredients: productIngredients,
        productDiseases: productDiseases,
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
