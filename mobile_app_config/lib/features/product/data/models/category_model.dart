import '../../domain/entities/category.dart';

/// Category data model
class CategoryModel extends Category {
  const CategoryModel({
    required super.categoryId,
    required super.categoryName,
    super.description,
    super.imageUrl,
  });

  /// Factory constructor to create CategoryModel from JSON
  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      categoryId: json['category_id'] as String,
      categoryName: json['category_name'] as String,
      description: json['description'] as String?,
      imageUrl: json['image_url'] as String?,
    );
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() => {
        'category_id': categoryId,
        'category_name': categoryName,
        'description': description,
        'image_url': imageUrl,
      };

  /// Convert to domain entity
  Category toEntity() => Category(
        categoryId: categoryId,
        categoryName: categoryName,
        description: description,
        imageUrl: imageUrl,
      );

  /// Create from entity
  factory CategoryModel.fromEntity(Category entity) {
    return CategoryModel(
      categoryId: entity.categoryId,
      categoryName: entity.categoryName,
      description: entity.description,
      imageUrl: entity.imageUrl,
    );
  }
}
