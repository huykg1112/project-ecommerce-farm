import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

/// Reusable bottom action bar for product detail, checkout, etc.
class BottomActionBar extends StatelessWidget {
  final Widget? leadingWidget;
  final List<ActionButton> actions;
  final EdgeInsets? padding;
  final Color? backgroundColor;
  final bool showShadow;

  const BottomActionBar({
    super.key,
    this.leadingWidget,
    required this.actions,
    this.padding,
    this.backgroundColor,
    this.showShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Container(
      padding: padding ??
          EdgeInsets.only(
            left: 16,
            right: 16,
            top: 12,
            bottom: bottomPadding + 12,
          ),
      decoration: BoxDecoration(
        color: backgroundColor ?? (isDark ? AppColors.cardDark : Colors.white),
        boxShadow: showShadow
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ]
            : null,
      ),
      child: Row(
        children: [
          if (leadingWidget != null) ...[
            leadingWidget!,
            const SizedBox(width: 12),
          ],
          ...actions.asMap().entries.map((entry) {
            final index = entry.key;
            final action = entry.value;
            return Expanded(
              flex: action.flex,
              child: Padding(
                padding: EdgeInsets.only(
                  left: index > 0 ? 8 : 0,
                ),
                child: _buildButton(action, isDark),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildButton(ActionButton action, bool isDark) {
    final buttonStyle = action.isPrimary
        ? ElevatedButton.styleFrom(
            backgroundColor: action.color ?? AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 0,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          )
        : OutlinedButton.styleFrom(
            foregroundColor: action.color ?? AppColors.primary,
            side: BorderSide(
              color: action.color ?? AppColors.primary,
              width: 2,
            ),
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          );

    final child = Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (action.icon != null) ...[
          Icon(action.icon, size: 20),
          const SizedBox(width: 8),
        ],
        Text(
          action.label,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ],
    );

    if (action.isPrimary) {
      return ElevatedButton(
        onPressed: action.onPressed,
        style: buttonStyle,
        child: child,
      );
    }

    return OutlinedButton(
      onPressed: action.onPressed,
      style: buttonStyle,
      child: child,
    );
  }
}

/// Action button configuration
class ActionButton {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isPrimary;
  final Color? color;
  final int flex;

  const ActionButton({
    required this.label,
    this.onPressed,
    this.icon,
    this.isPrimary = false,
    this.color,
    this.flex = 1,
  });

  /// Primary action button
  factory ActionButton.primary({
    required String label,
    VoidCallback? onPressed,
    IconData? icon,
    int flex = 1,
  }) {
    return ActionButton(
      label: label,
      onPressed: onPressed,
      icon: icon,
      isPrimary: true,
      flex: flex,
    );
  }

  /// Secondary/outlined action button
  factory ActionButton.secondary({
    required String label,
    VoidCallback? onPressed,
    IconData? icon,
    int flex = 1,
  }) {
    return ActionButton(
      label: label,
      onPressed: onPressed,
      icon: icon,
      isPrimary: false,
      flex: flex,
    );
  }
}

/// Simple icon button for action bar leading
class ActionBarIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final Color? iconColor;
  final double size;

  const ActionBarIconButton({
    super.key,
    required this.icon,
    this.onPressed,
    this.iconColor,
    this.size = 48,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        border: Border.all(
          color: isDark ? AppColors.borderDark : Colors.grey[300]!,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: IconButton(
        icon: Icon(
          icon,
          color: iconColor ?? AppColors.primary,
        ),
        onPressed: onPressed,
      ),
    );
  }
}
