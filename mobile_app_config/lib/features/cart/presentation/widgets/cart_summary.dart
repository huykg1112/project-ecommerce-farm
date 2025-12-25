import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../shared/widgets/common/app_button.dart';
import '../../domain/entities/cart.dart';

/// Cart Summary Widget with total and checkout button
class CartSummary extends StatelessWidget {
  final Cart cart;
  final VoidCallback onCheckout;

  const CartSummary({
    super.key,
    required this.cart,
    required this.onCheckout,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Summary rows
            _buildSummaryRow(
              'Số lượng sản phẩm',
              '${cart.totalQuantity} sản phẩm',
            ),
            const SizedBox(height: 8),
            _buildSummaryRow(
              'Tạm tính',
              _formatPrice(cart.totalAmount),
              isBold: true,
            ),

            const SizedBox(height: 16),

            // Checkout button
            AppButton.primary(
              text: 'Thanh toán',
              isFullWidth: true,
              size: ButtonSize.large,
              icon: const Icon(Icons.shopping_cart_checkout,
                  color: Colors.white, size: 20),
              onPressed: cart.isNotEmpty ? onCheckout : null,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: isBold
              ? AppTextStyles.bodyLarge.copyWith(fontWeight: FontWeight.w600)
              : AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.mutedForeground,
                ),
        ),
        Text(
          value,
          style: isBold
              ? AppTextStyles.h4.copyWith(color: AppColors.primary)
              : AppTextStyles.bodyMedium,
        ),
      ],
    );
  }

  String _formatPrice(double price) {
    return '${price.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]}.',
        )}đ';
  }
}
