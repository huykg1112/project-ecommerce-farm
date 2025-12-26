import 'package:flutter/material.dart';

/// Reusable rating stars widget
class RatingStars extends StatelessWidget {
  final double rating;
  final int maxRating;
  final double size;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool showValue;
  final int? reviewCount;
  final TextStyle? valueStyle;
  final TextStyle? countStyle;

  const RatingStars({
    super.key,
    required this.rating,
    this.maxRating = 5,
    this.size = 16,
    this.activeColor,
    this.inactiveColor,
    this.showValue = false,
    this.reviewCount,
    this.valueStyle,
    this.countStyle,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveActiveColor = activeColor ?? Colors.amber;
    final effectiveInactiveColor =
        inactiveColor ?? (isDark ? Colors.grey[600] : Colors.grey[300]);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Stars
        ...List.generate(maxRating, (index) {
          final starValue = index + 1;
          IconData icon;
          Color color;

          if (rating >= starValue) {
            // Full star
            icon = Icons.star;
            color = effectiveActiveColor;
          } else if (rating >= starValue - 0.5) {
            // Half star
            icon = Icons.star_half;
            color = effectiveActiveColor;
          } else {
            // Empty star
            icon = Icons.star_border;
            color = effectiveInactiveColor!;
          }

          return Icon(icon, size: size, color: color);
        }),

        // Rating value
        if (showValue) ...[
          const SizedBox(width: 4),
          Text(
            rating.toStringAsFixed(1),
            style: valueStyle ??
                TextStyle(
                  fontSize: size * 0.875,
                  fontWeight: FontWeight.w600,
                  color: isDark ? Colors.white : Colors.black87,
                ),
          ),
        ],

        // Review count
        if (reviewCount != null) ...[
          const SizedBox(width: 4),
          Text(
            '($reviewCount)',
            style: countStyle ??
                TextStyle(
                  fontSize: size * 0.75,
                  color: isDark ? Colors.grey[400] : Colors.grey[600],
                ),
          ),
        ],
      ],
    );
  }
}

/// Interactive rating stars for input
class RatingStarsInput extends StatelessWidget {
  final double rating;
  final ValueChanged<double> onRatingChanged;
  final int maxRating;
  final double size;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool allowHalfRating;

  const RatingStarsInput({
    super.key,
    required this.rating,
    required this.onRatingChanged,
    this.maxRating = 5,
    this.size = 32,
    this.activeColor,
    this.inactiveColor,
    this.allowHalfRating = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveActiveColor = activeColor ?? Colors.amber;
    final effectiveInactiveColor =
        inactiveColor ?? (isDark ? Colors.grey[600] : Colors.grey[300]);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(maxRating, (index) {
        final starValue = index + 1;
        final isFilled = rating >= starValue;
        final isHalf = !isFilled && rating >= starValue - 0.5;

        return GestureDetector(
          onTap: () {
            if (allowHalfRating && rating == starValue) {
              onRatingChanged(starValue - 0.5);
            } else {
              onRatingChanged(starValue.toDouble());
            }
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: Icon(
              isFilled
                  ? Icons.star
                  : isHalf
                      ? Icons.star_half
                      : Icons.star_border,
              size: size,
              color: isFilled || isHalf
                  ? effectiveActiveColor
                  : effectiveInactiveColor,
            ),
          ),
        );
      }),
    );
  }
}
