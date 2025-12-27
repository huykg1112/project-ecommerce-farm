import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/states/empty_state_view.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../bloc/local_cart_bloc.dart';

/// Local Cart Page - uses SharedPreferences like frontend
class LocalCartPage extends StatelessWidget {
  const LocalCartPage({super.key});

  String _formatPrice(double price) {
    final formatter = NumberFormat('#,###', 'vi_VN');
    return '${formatter.format(price)} đ';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Giỏ hàng'),
        actions: [
          BlocBuilder<LocalCartBloc, LocalCartState>(
            builder: (context, state) {
              if (state is LocalCartLoaded && state.isNotEmpty) {
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
      body: BlocBuilder<LocalCartBloc, LocalCartState>(
        builder: (context, state) {
          if (state is LocalCartLoading || state is LocalCartInitial) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is LocalCartError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: isDark ? Colors.red[300] : Colors.red,
                  ),
                  const SizedBox(height: 16),
                  Text(state.message),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<LocalCartBloc>().add(const LoadLocalCart());
                    },
                    child: const Text('Thử lại'),
                  ),
                ],
              ),
            );
          }

          if (state is LocalCartLoaded) {
            if (state.isEmpty) {
              return EmptyStateView.emptyCart(
                onShopNow: () => context.go('/home'),
              );
            }

            // Group items by seller
            final itemsBySeller = <String, List<LocalCartItem>>{};
            for (final item in state.items) {
              if (!itemsBySeller.containsKey(item.sellerId)) {
                itemsBySeller[item.sellerId] = [];
              }
              itemsBySeller[item.sellerId]!.add(item);
            }

            return Column(
              children: [
                // Header (Select All)
                _buildCartHeader(context, state, isDark),

                // Cart items list (Grouped by Seller)
                Expanded(
                  child: ListView.separated(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: itemsBySeller.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final sellerId = itemsBySeller.keys.elementAt(index);
                      final items = itemsBySeller[sellerId]!;
                      return _buildSellerGroup(
                          context, state, sellerId, items, isDark);
                    },
                  ),
                ),

                // Cart Summary
                _buildCartSummary(context, state, isDark),
              ],
            );
          }

          // Fallback - should not happen
          return EmptyStateView.emptyCart(
            onShopNow: () => context.go('/home'),
          );
        },
      ),
    );
  }

  Widget _buildCartHeader(
    BuildContext context,
    LocalCartLoaded state,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Row(
        children: [
          Checkbox(
            value: state.isAllSelected,
            onChanged: (value) {
              if (value == true) {
                context.read<LocalCartBloc>().add(const SelectAllCartItems());
              } else {
                context.read<LocalCartBloc>().add(const DeselectAllCartItems());
              }
            },
            activeColor: AppColors.primary,
          ),
          const Text('Chọn tất cả'),
          const Spacer(),
          TextButton.icon(
            icon: const Icon(Icons.delete_outline, size: 18),
            label: const Text('Xóa'),
            style: TextButton.styleFrom(foregroundColor: AppColors.destructive),
            onPressed: () => _showClearCartDialog(context),
          ),
        ],
      ),
    );
  }

  Widget _buildSellerGroup(
    BuildContext context,
    LocalCartLoaded state,
    String sellerId,
    List<LocalCartItem> items,
    bool isDark,
  ) {
    final sellerName = items.first.sellerName;
    final isSellerSelected = state.isSellerSelected(sellerId);

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Seller Header
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 8, 16, 8),
            child: Row(
              children: [
                Checkbox(
                  value: isSellerSelected,
                  onChanged: (value) {
                    context
                        .read<LocalCartBloc>()
                        .add(ToggleCartSellerSelection(sellerId));
                  },
                  activeColor: AppColors.primary,
                ),
                Icon(Icons.store,
                    size: 18,
                    color: isDark ? Colors.grey[400] : Colors.grey[600]),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    sellerName,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          // Items
          ...items
              .map((item) => _buildCartItemCard(context, state, item, isDark)),
        ],
      ),
    );
  }

  Widget _buildCartItemCard(
    BuildContext context,
    LocalCartLoaded state,
    LocalCartItem item,
    bool isDark,
  ) {
    final isSelected = state.selectedItemIds.contains(item.id);

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Checkbox(
            value: isSelected,
            onChanged: (value) {
              context
                  .read<LocalCartBloc>()
                  .add(ToggleCartItemSelection(item.id));
            },
            activeColor: AppColors.primary,
          ),
          // Product Image
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: item.imageUrl.isNotEmpty
                ? Image.network(
                    item.imageUrl,
                    width: 70,
                    height: 70,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 70,
                      height: 70,
                      color: isDark ? Colors.grey[800] : Colors.grey[200],
                      child: const Icon(Icons.image_not_supported),
                    ),
                  )
                : Container(
                    width: 70,
                    height: 70,
                    color: isDark ? Colors.grey[800] : Colors.grey[200],
                    child: const Icon(Icons.image),
                  ),
          ),

          const SizedBox(width: 12),

          // Product Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (item.batchName != null) ...[
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      item.batchName!,
                      style: TextStyle(
                        fontSize: 10,
                        color: AppColors.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 4),
                Row(
                  children: [
                    if (item.hasDiscount) ...[
                      Text(
                        _formatPrice(item.price),
                        style: TextStyle(
                          fontSize: 11,
                          color: isDark ? Colors.grey[500] : Colors.grey[600],
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                      const SizedBox(width: 6),
                    ],
                    Text(
                      _formatPrice(item.finalPrice),
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Quantity Controls
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              IconButton(
                icon: const Icon(Icons.delete_outline, size: 18),
                color: AppColors.destructive,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () {
                  _showRemoveItemDialog(context, item);
                },
              ),
              const SizedBox(height: 8),
              Container(
                height: 28,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: isDark ? Colors.grey[700]! : Colors.grey[300]!,
                  ),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    InkWell(
                      onTap: () {
                        context
                            .read<LocalCartBloc>()
                            .add(DecrementLocalCartQuantity(item.id));
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Icon(
                          Icons.remove,
                          size: 14,
                          color: isDark ? Colors.white : Colors.black,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Text(
                        '${item.quantity}',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : Colors.black,
                        ),
                      ),
                    ),
                    InkWell(
                      onTap: () {
                        context
                            .read<LocalCartBloc>()
                            .add(IncrementLocalCartQuantity(item.id));
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Icon(
                          Icons.add,
                          size: 14,
                          color: isDark ? Colors.white : Colors.black,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCartSummary(
    BuildContext context,
    LocalCartLoaded state,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Tổng thanh toán (${state.selectedItemsCount} sản phẩm):',
                  style: TextStyle(
                    fontSize: 14,
                    color: isDark ? Colors.grey[400] : Colors.grey[600],
                  ),
                ),
                Text(
                  _formatPrice(state.selectedTotalAmount),
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: state.selectedItemsCount > 0
                    ? () {
                        context.push('/checkout');
                        // CustomSnackBar.showInfo(
                        //   context,
                        //   message: 'Tính năng thanh toán đang được phát triển',
                        // );
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  disabledBackgroundColor:
                      isDark ? Colors.grey[800] : Colors.grey[300],
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Mua hàng',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showRemoveItemDialog(BuildContext context, LocalCartItem item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa sản phẩm'),
        content:
            Text('Bạn có chắc muốn xóa "${item.productName}" khỏi giỏ hàng?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<LocalCartBloc>().add(RemoveFromLocalCart(item.id));
              CustomSnackBar.showInfo(
                context,
                message: 'Đã xóa ${item.productName} khỏi giỏ hàng',
              );
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
              context.read<LocalCartBloc>().add(const ClearLocalCart());
              CustomSnackBar.showInfo(
                context,
                message: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
              );
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
