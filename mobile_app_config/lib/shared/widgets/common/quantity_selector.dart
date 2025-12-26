import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

/// Reusable quantity selector widget
class QuantitySelector extends StatelessWidget {
  final int quantity;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final int minQuantity;
  final int? maxQuantity;
  final double size;

  const QuantitySelector({
    super.key,
    required this.quantity,
    required this.onIncrement,
    required this.onDecrement,
    this.minQuantity = 1,
    this.maxQuantity,
    this.size = 40,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final canDecrement = quantity > minQuantity;
    final canIncrement = maxQuantity == null || quantity < maxQuantity!;

    return Container(
      decoration: BoxDecoration(
        border: Border.all(
          color: isDark ? AppColors.borderDark : Colors.grey[300]!,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Decrement button
          _buildButton(
            icon: Icons.remove,
            onTap: canDecrement ? onDecrement : null,
            isDark: isDark,
            enabled: canDecrement,
          ),
          // Quantity display
          Container(
            width: size + 10,
            height: size,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              border: Border.symmetric(
                vertical: BorderSide(
                  color: isDark ? AppColors.borderDark : Colors.grey[300]!,
                ),
              ),
            ),
            child: Text(
              quantity.toString(),
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
          ),
          // Increment button
          _buildButton(
            icon: Icons.add,
            onTap: canIncrement ? onIncrement : null,
            isDark: isDark,
            enabled: canIncrement,
          ),
        ],
      ),
    );
  }

  Widget _buildButton({
    required IconData icon,
    required VoidCallback? onTap,
    required bool isDark,
    required bool enabled,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        child: Icon(
          icon,
          size: 20,
          color:
              enabled ? (isDark ? Colors.white : Colors.black87) : Colors.grey,
        ),
      ),
    );
  }
}
