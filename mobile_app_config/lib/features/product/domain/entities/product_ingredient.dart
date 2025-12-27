import 'package:equatable/equatable.dart';

/// Ingredient entity
class Ingredient extends Equatable {
  final String ingredientId;
  final String ingredientName;
  final String? description;

  const Ingredient({
    required this.ingredientId,
    required this.ingredientName,
    this.description,
  });

  @override
  List<Object?> get props => [ingredientId, ingredientName, description];
}

/// Product-Ingredient relationship entity
class ProductIngredient extends Equatable {
  final String productIngredientId;
  final Ingredient ingredient;
  final bool isPrimary; // Đánh dấu thành phần chính

  const ProductIngredient({
    required this.productIngredientId,
    required this.ingredient,
    this.isPrimary = false,
  });

  @override
  List<Object?> get props => [productIngredientId, ingredient, isPrimary];
}
