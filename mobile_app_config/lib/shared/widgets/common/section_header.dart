import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

/// Reusable section header with optional action
class SectionHeader extends StatelessWidget {
  final String title;
  final String? actionText;
  final VoidCallback? onActionTap;
  final IconData? actionIcon;
  final TextStyle? titleStyle;
  final EdgeInsets? padding;

  const SectionHeader({
    super.key,
    required this.title,
    this.actionText,
    this.onActionTap,
    this.actionIcon,
    this.titleStyle,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding:
          padding ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: titleStyle ??
                TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
          ),
          if (actionText != null || actionIcon != null)
            GestureDetector(
              onTap: onActionTap,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (actionText != null)
                    Text(
                      actionText!,
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  if (actionIcon != null) ...[
                    if (actionText != null) const SizedBox(width: 4),
                    Icon(
                      actionIcon,
                      size: 18,
                      color: AppColors.primary,
                    ),
                  ],
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Simple section title without action
class SectionTitle extends StatelessWidget {
  final String title;
  final EdgeInsets? padding;
  final TextStyle? style;

  const SectionTitle({
    super.key,
    required this.title,
    this.padding,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: padding ?? const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: style ??
            TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white : Colors.black87,
            ),
      ),
    );
  }
}
