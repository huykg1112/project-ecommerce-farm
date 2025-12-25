import 'package:equatable/equatable.dart';

/// Category entity
class Category extends Equatable {
  final String categoryId;
  final String categoryName;
  final String? description;
  final String? imageUrl;

  const Category({
    required this.categoryId,
    required this.categoryName,
    this.description,
    this.imageUrl,
  });

  @override
  List<Object?> get props => [
        categoryId,
        categoryName,
        description,
        imageUrl,
      ];
}
