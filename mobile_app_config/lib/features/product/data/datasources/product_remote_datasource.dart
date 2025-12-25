import 'package:injectable/injectable.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/constants/api_constants.dart';
import '../models/product_model.dart';

/// Product Remote Data Source
abstract class ProductRemoteDataSource {
  Future<List<ProductModel>> getProducts();
  Future<ProductModel> getProductById(String productId);
  Future<List<ProductModel>> searchProducts(String query);
  Future<List<ProductModel>> getRecommendedProducts();
  Future<List<ProductModel>> getPopularProducts();
}

@LazySingleton(as: ProductRemoteDataSource)
class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final DioClient _dioClient;

  ProductRemoteDataSourceImpl(this._dioClient);

  @override
  Future<List<ProductModel>> getProducts() async {
    try {
      final response = await _dioClient.get(ApiConstants.productsForUsers);

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data as List<dynamic>;
        return data.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<ProductModel> getProductById(String productId) async {
    try {
      final response =
          await _dioClient.get('${ApiConstants.products}/$productId');

      if (response.statusCode == 200) {
        return ProductModel.fromJson(response.data);
      } else {
        throw Exception('Failed to load product detail');
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<ProductModel>> searchProducts(String query) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.advancedSearch,
        data: {'keyword': query},
      );

      if (response.statusCode == 200) {
        final data = response.data['data'] as List<dynamic>;
        return data.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to search products');
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<ProductModel>> getRecommendedProducts() async {
    try {
      final response = await _dioClient.get(ApiConstants.recommendations);

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data as List<dynamic>;
        return data.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load recommendations');
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<ProductModel>> getPopularProducts() async {
    try {
      final response = await _dioClient.get(ApiConstants.popularProducts);

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data as List<dynamic>;
        return data.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load popular products');
      }
    } catch (e) {
      rethrow;
    }
  }
}
