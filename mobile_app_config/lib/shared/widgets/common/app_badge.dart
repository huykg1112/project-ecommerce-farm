import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

/// Reusable badge widget for labels, tags, discounts
class AppBadge extends StatelessWidget {
  final String text;
  final Color? backgroundColor;
  final Color? textColor;
  final IconData? icon;
  final double? iconSize;
  final EdgeInsets? padding;
  final double borderRadius;
  final TextStyle? textStyle;
  final BadgeSize size;

  const AppBadge({
    super.key,
    required this.text,
    this.backgroundColor,
    this.textColor,
    this.icon,
    this.iconSize,
    this.padding,
    this.borderRadius = 4,
    this.textStyle,
    this.size = BadgeSize.medium,
  });

  /// Discount badge (red background)
  factory AppBadge.discount(String percentage) {
    return AppBadge(
      text: '-$percentage%',
      backgroundColor: AppColors.destructive,
      textColor: Colors.white,
      size: BadgeSize.small,
    );
  }

  /// Category badge (primary background)
  factory AppBadge.category(String name) {
    return AppBadge(
      text: name,
      backgroundColor: AppColors.primary.withOpacity(0.1),
      textColor: AppColors.primary,
      size: BadgeSize.small,
    );
  }

  /// Status badge with icon
  factory AppBadge.status({
    required String text,
    required Color color,
    IconData? icon,
  }) {
    return AppBadge(
      text: text,
      backgroundColor: color.withOpacity(0.1),
      textColor: color,
      icon: icon,
      size: BadgeSize.medium,
    );
  }

  /// New badge
  factory AppBadge.newItem() {
    return const AppBadge(
      text: 'MỚI',
      backgroundColor: AppColors.primary,
      textColor: Colors.white,
      size: BadgeSize.small,
    );
  }

  /// Sale badge
  factory AppBadge.sale() {
    return const AppBadge(
      text: 'SALE',
      backgroundColor: AppColors.destructive,
      textColor: Colors.white,
      size: BadgeSize.small,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final effectiveBgColor =
        backgroundColor ?? (isDark ? AppColors.cardDark : Colors.grey[100]);
    final effectiveTextColor =
        textColor ?? (isDark ? Colors.white : Colors.black87);

    final double fontSize;
    final EdgeInsets effectivePadding;
    final double effectiveIconSize;

    switch (size) {
      case BadgeSize.small:
        fontSize = 10;
        effectivePadding = padding ??
            const EdgeInsets.symmetric(
              horizontal: 6,
              vertical: 2,
            );
        effectiveIconSize = iconSize ?? 12;
        break;
      case BadgeSize.large:
        fontSize = 14;
        effectivePadding = padding ??
            const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 6,
            );
        effectiveIconSize = iconSize ?? 18;
        break;
      case BadgeSize.medium:
      default:
        fontSize = 12;
        effectivePadding = padding ??
            const EdgeInsets.symmetric(
              horizontal: 8,
              vertical: 4,
            );
        effectiveIconSize = iconSize ?? 14;
    }

    return Container(
      padding: effectivePadding,
      decoration: BoxDecoration(
        color: effectiveBgColor,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: effectiveIconSize, color: effectiveTextColor),
            const SizedBox(width: 4),
          ],
          Text(
            text,
            style: textStyle ??
                TextStyle(
                  fontSize: fontSize,
                  fontWeight: FontWeight.w600,
                  color: effectiveTextColor,
                ),
          ),
        ],
      ),
    );
  }
}

enum BadgeSize { small, medium, large }

/// Removable filter chip badge
class FilterBadge extends StatelessWidget {
  final String text;
  final IconData? icon;
  final VoidCallback? onRemove;
  final Color? color;

  const FilterBadge({
    super.key,
    required this.text,
    this.icon,
    this.onRemove,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveColor = color ?? AppColors.primary;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: effectiveColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: effectiveColor.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14, color: effectiveColor),
            const SizedBox(width: 4),
          ],
          Text(
            text,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white : effectiveColor,
            ),
          ),
          if (onRemove != null) ...[
            const SizedBox(width: 4),
            GestureDetector(
              onTap: onRemove,
              child: Icon(
                Icons.close,
                size: 14,
                color: isDark ? Colors.white70 : effectiveColor,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
