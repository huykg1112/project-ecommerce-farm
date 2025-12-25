import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/product.dart';

/// Product Repository Interface
abstract class ProductRepository {
  /// Get all products for users
  Future<Either<Failure, List<Product>>> getProducts();

  /// Get product by ID
  Future<Either<Failure, Product>> getProductById(String productId);

  /// Search products
  Future<Either<Failure, List<Product>>> searchProducts(String query);

  /// Get recommended products
  Future<Either<Failure, List<Product>>> getRecommendedProducts();

  /// Get popular products
  Future<Either<Failure, List<Product>>> getPopularProducts();

  /// Get products by category
  Future<Either<Failure, List<Product>>> getProductsByCategory(
      String categoryId);
}
