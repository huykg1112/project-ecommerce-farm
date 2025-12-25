import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

/// Empty state view for when there's no data to display
class EmptyStateView extends StatelessWidget {
  final String title;
  final String? message;
  final IconData? icon;
  final String? imagePath;
  final Widget? action;
  final double iconSize;
  final Color? iconColor;

  const EmptyStateView({
    super.key,
    required this.title,
    this.message,
    this.icon,
    this.imagePath,
    this.action,
    this.iconSize = 80,
    this.iconColor,
  });

  /// Factory for empty cart state
  factory EmptyStateView.emptyCart({VoidCallback? onShopNow}) {
    return EmptyStateView(
      title: 'Giỏ hàng trống',
      message: 'Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm',
      icon: Icons.shopping_cart_outlined,
      action: onShopNow != null
          ? ElevatedButton(
              onPressed: onShopNow,
              child: const Text('Mua sắm ngay'),
            )
          : null,
    );
  }

  /// Factory for empty wishlist state
  factory EmptyStateView.emptyWishlist({VoidCallback? onBrowse}) {
    return EmptyStateView(
      title: 'Chưa có sản phẩm yêu thích',
      message: 'Lưu các sản phẩm yêu thích để dễ dàng mua lại sau',
      icon: Icons.favorite_border,
      action: onBrowse != null
          ? ElevatedButton(
              onPressed: onBrowse,
              child: const Text('Khám phá sản phẩm'),
            )
          : null,
    );
  }

  /// Factory for empty orders state
  factory EmptyStateView.emptyOrders({VoidCallback? onShopNow}) {
    return EmptyStateView(
      title: 'Chưa có đơn hàng',
      message: 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!',
      icon: Icons.receipt_long_outlined,
      action: onShopNow != null
          ? ElevatedButton(
              onPressed: onShopNow,
              child: const Text('Mua sắm ngay'),
            )
          : null,
    );
  }

  /// Factory for empty search results
  factory EmptyStateView.noSearchResults(
      {String? query, VoidCallback? onClear}) {
    return EmptyStateView(
      title: 'Không tìm thấy kết quả',
      message: query != null
          ? 'Không tìm thấy sản phẩm nào cho "$query"'
          : 'Thử tìm kiếm với từ khóa khác',
      icon: Icons.search_off,
      action: onClear != null
          ? TextButton(
              onPressed: onClear,
              child: const Text('Xóa bộ lọc'),
            )
          : null,
    );
  }

  /// Factory for empty notifications
  factory EmptyStateView.noNotifications() {
    return const EmptyStateView(
      title: 'Không có thông báo',
      message: 'Bạn chưa có thông báo nào',
      icon: Icons.notifications_off_outlined,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Icon or Image
            if (imagePath != null)
              Image.asset(
                imagePath!,
                width: iconSize,
                height: iconSize,
              )
            else if (icon != null)
              Icon(
                icon,
                size: iconSize,
                color: iconColor ?? AppColors.mutedForeground,
              ),

            const SizedBox(height: 24),

            // Title
            Text(
              title,
              style: AppTextStyles.h3.copyWith(
                color: AppColors.foreground,
              ),
              textAlign: TextAlign.center,
            ),

            // Message
            if (message != null) ...[
              const SizedBox(height: 8),
              Text(
                message!,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.mutedForeground,
                ),
                textAlign: TextAlign.center,
              ),
            ],

            // Action button
            if (action != null) ...[
              const SizedBox(height: 24),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}
