import 'package:injectable/injectable.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/network/dio_client.dart';
import '../models/cart_model.dart';
import 'cart_remote_datasource.dart';

/// Cart Remote Data Source Implementation
@LazySingleton(as: CartRemoteDataSource)
class CartRemoteDataSourceImpl implements CartRemoteDataSource {
  final DioClient _dioClient;

  CartRemoteDataSourceImpl(this._dioClient);

  @override
  Future<CartModel> getCart() async {
    try {
      final response = await _dioClient.get(ApiConstants.cart);

      if (response.statusCode == 200) {
        final data = response.data;
        // Backend returns list of cart items directly
        if (data is List) {
          return CartModel.fromJson(data);
        } else if (data is Map && data['items'] != null) {
          return CartModel.fromJson(data['items'] as List);
        }
        return CartModel.fromJson([]);
      } else {
        throw ServerException(
          message: 'Failed to get cart',
          code: response.statusCode,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<CartModel> addToCart({
    required String productId,
    required int quantity,
  }) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.addToCart,
        data: {
          'product_id': productId,
          'quantity': quantity,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // After adding, fetch updated cart
        return await getCart();
      } else {
        throw ServerException(
          message: 'Failed to add to cart',
          code: response.statusCode,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<CartModel> updateCartItem({
    required String cartItemId,
    required int quantity,
  }) async {
    try {
      final response = await _dioClient.patch(
        ApiConstants.updateCart,
        data: {
          'cart_item_id': cartItemId,
          'quantity': quantity,
        },
      );

      if (response.statusCode == 200) {
        // After updating, fetch updated cart
        return await getCart();
      } else {
        throw ServerException(
          message: 'Failed to update cart',
          code: response.statusCode,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<CartModel> removeFromCart(String cartItemId) async {
    try {
      final path = ApiConstants.replacePath(
        ApiConstants.removeFromCart,
        {'id': cartItemId},
      );

      final response = await _dioClient.delete(path);

      if (response.statusCode == 200) {
        // After removing, fetch updated cart
        return await getCart();
      } else {
        throw ServerException(
          message: 'Failed to remove from cart',
          code: response.statusCode,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> clearCart() async {
    try {
      final response = await _dioClient.delete(ApiConstants.clearCart);

      if (response.statusCode != 200) {
        throw ServerException(
          message: 'Failed to clear cart',
          code: response.statusCode,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<int> getCartItemCount() async {
    try {
      final response = await _dioClient.get(ApiConstants.cartItemCount);

      if (response.statusCode == 200) {
        return response.data['count'] as int? ?? 0;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }
}
