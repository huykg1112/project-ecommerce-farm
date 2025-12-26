import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../shared/widgets/states/empty_state_view.dart';
import '../../../../shared/widgets/states/error_state_view.dart';
import '../../../../shared/widgets/loading/loading_widget.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../../domain/entities/cart.dart';
import '../bloc/cart_bloc.dart';
import '../bloc/cart_event.dart';
import '../bloc/cart_state.dart';
import '../widgets/cart_item_card.dart';
import '../widgets/cart_summary.dart';

/// Cart Page
class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  @override
  void initState() {
    super.initState();
    context.read<CartBloc>().add(const LoadCart());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Giỏ hàng'),
        actions: [
          BlocBuilder<CartBloc, CartState>(
            builder: (context, state) {
              if (state is CartLoaded && state.cart.isNotEmpty) {
                return IconButton(
                  icon: const Icon(Icons.delete_outline),
                  onPressed: () => _showClearCartDialog(context),
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ],
      ),
      body: BlocConsumer<CartBloc, CartState>(
        listener: (context, state) {
          if (state is CartItemAdded) {
            CustomSnackBar.showSuccess(
              context,
              message: 'Đã thêm ${state.productName} vào giỏ hàng',
            );
          } else if (state is CartCleared) {
            CustomSnackBar.showInfo(
              context,
              message: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
            );
          } else if (state is CartError) {
            CustomSnackBar.showError(
              context,
              message: state.message,
            );
          }
        },
        builder: (context, state) {
          if (state is CartLoading) {
            return const LoadingWidget(message: 'Đang tải giỏ hàng...');
          }

          if (state is CartError && state.previousCart == null) {
            return ErrorStateView.genericError(
              message: state.message,
              onRetry: () {
                context.read<CartBloc>().add(const LoadCart());
              },
            );
          }

          // Get cart from state
          Cart? cart;
          if (state is CartLoaded) {
            cart = state.cart;
          } else if (state is CartOperationInProgress) {
            cart = state.cart;
          } else if (state is CartError) {
            cart = state.previousCart;
          }

          if (cart == null || cart.isEmpty) {
            return EmptyStateView.emptyCart(
              onShopNow: () => context.go('/home'),
            );
          }

          return _buildCartContent(
              context, cart, state is CartOperationInProgress);
        },
      ),
    );
  }

  Widget _buildCartContent(BuildContext context, Cart cart, bool isLoading) {
    return Column(
      children: [
        // Cart items list
        Expanded(
          child: Stack(
            children: [
              ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: cart.items.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final item = cart.items[index];
                  return CartItemCard(
                    item: item,
                    onQuantityChanged: (quantity) {
                      if (quantity <= 0) {
                        _showRemoveItemDialog(
                            context, item.cartItemId, item.productName);
                      } else {
                        context.read<CartBloc>().add(UpdateCartItemEvent(
                              cartItemId: item.cartItemId,
                              quantity: quantity,
                            ));
                      }
                    },
                    onRemove: () {
                      _showRemoveItemDialog(
                          context, item.cartItemId, item.productName);
                    },
                  );
                },
              ),
              if (isLoading)
                Container(
                  color: Colors.black12,
                  child: const LoadingWidget(),
                ),
            ],
          ),
        ),

        // Cart summary and checkout button
        CartSummary(
          cart: cart,
          onCheckout: () {
            // TODO: Navigate to checkout
            context.push('/checkout');
          },
        ),
      ],
    );
  }

  void _showRemoveItemDialog(
      BuildContext context, String cartItemId, String productName) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa sản phẩm'),
        content: Text('Bạn có chắc muốn xóa "$productName" khỏi giỏ hàng?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<CartBloc>().add(RemoveFromCartEvent(cartItemId));
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.destructive,
            ),
            child: const Text('Xóa'),
          ),
        ],
      ),
    );
  }

  void _showClearCartDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa giỏ hàng'),
        content:
            const Text('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<CartBloc>().add(const ClearCartEvent());
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.destructive,
            ),
            child: const Text('Xóa tất cả'),
          ),
        ],
      ),
    );
  }
}
