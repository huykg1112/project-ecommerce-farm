import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../core/theme/app_colors.dart';

/// Reusable price display widget with optional discount
class PriceDisplay extends StatelessWidget {
  final double price;
  final double? originalPrice;
  final double? discountPercentage;
  final TextStyle? priceStyle;
  final TextStyle? originalPriceStyle;
  final String currency;
  final bool showDiscount;
  final Axis direction;
  final CrossAxisAlignment crossAxisAlignment;

  const PriceDisplay({
    super.key,
    required this.price,
    this.originalPrice,
    this.discountPercentage,
    this.priceStyle,
    this.originalPriceStyle,
    this.currency = 'đ',
    this.showDiscount = true,
    this.direction = Axis.horizontal,
    this.crossAxisAlignment = CrossAxisAlignment.end,
  });

  String _formatPrice(double value) {
    final formatter = NumberFormat('#,###', 'vi_VN');
    return '${formatter.format(value)} $currency';
  }

  bool get hasDiscount => discountPercentage != null && discountPercentage! > 0;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final priceWidget = Text(
      _formatPrice(price),
      style: priceStyle ??
          TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
          ),
    );

    final originalPriceWidget = originalPrice != null && hasDiscount
        ? Text(
            _formatPrice(originalPrice!),
            style: originalPriceStyle ??
                TextStyle(
                  fontSize: 13,
                  color: isDark ? Colors.grey[500] : Colors.grey[600],
                  decoration: TextDecoration.lineThrough,
                ),
          )
        : null;

    if (direction == Axis.vertical) {
      return Column(
        crossAxisAlignment: crossAxisAlignment == CrossAxisAlignment.end
            ? CrossAxisAlignment.start
            : crossAxisAlignment,
        mainAxisSize: MainAxisSize.min,
        children: [
          priceWidget,
          if (originalPriceWidget != null) ...[
            const SizedBox(height: 2),
            originalPriceWidget,
          ],
        ],
      );
    }

    return Row(
      crossAxisAlignment: crossAxisAlignment,
      mainAxisSize: MainAxisSize.min,
      children: [
        priceWidget,
        if (originalPriceWidget != null) ...[
          const SizedBox(width: 8),
          originalPriceWidget,
        ],
      ],
    );
  }
}

/// Compact price display for cards
class PriceDisplayCompact extends StatelessWidget {
  final double price;
  final double? originalPrice;

  const PriceDisplayCompact({
    super.key,
    required this.price,
    this.originalPrice,
  });

  @override
  Widget build(BuildContext context) {
    return PriceDisplay(
      price: price,
      originalPrice: originalPrice,
      discountPercentage: originalPrice != null && originalPrice! > price
          ? ((originalPrice! - price) / originalPrice! * 100)
          : null,
      direction: Axis.vertical,
      priceStyle: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.bold,
        color: AppColors.primary,
      ),
      originalPriceStyle: TextStyle(
        fontSize: 11,
        color: Colors.grey[600],
        decoration: TextDecoration.lineThrough,
      ),
    );
  }
}
