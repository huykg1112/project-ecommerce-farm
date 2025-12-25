import 'package:equatable/equatable.dart';

/// Product entity
class Product extends Equatable {
  final String productId;
  final String productName;
  final String? description;
  final String? usageInstructions;
  final double unitPrice;
  final int totalSaled;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> imageUrls;
  final List<String> categories;
  final String? manufacturerName;
  final double? averageRating;
  final int? reviewCount;

  const Product({
    required this.productId,
    required this.productName,
    this.description,
    this.usageInstructions,
    required this.unitPrice,
    this.totalSaled = 0,
    this.isActive = true,
    required this.createdAt,
    required this.updatedAt,
    this.imageUrls = const [],
    this.categories = const [],
    this.manufacturerName,
    this.averageRating,
    this.reviewCount,
  });

  @override
  List<Object?> get props => [
        productId,
        productName,
        description,
        usageInstructions,
        unitPrice,
        totalSaled,
        isActive,
        createdAt,
        updatedAt,
        imageUrls,
        categories,
        manufacturerName,
        averageRating,
        reviewCount,
      ];
}
