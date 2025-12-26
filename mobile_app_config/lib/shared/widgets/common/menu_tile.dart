import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

/// Reusable menu tile for profile, settings pages
class MenuTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final Widget? trailing;
  final Color? iconColor;
  final Color? iconBackgroundColor;
  final bool showChevron;
  final EdgeInsets? padding;

  const MenuTile({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
    this.trailing,
    this.iconColor,
    this.iconBackgroundColor,
    this.showChevron = true,
    this.padding,
  });

  /// Menu tile with switch
  factory MenuTile.withSwitch({
    required IconData icon,
    required String title,
    String? subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    Color? iconColor,
  }) {
    return MenuTile(
      icon: icon,
      title: title,
      subtitle: subtitle,
      iconColor: iconColor,
      showChevron: false,
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: AppColors.primary,
      ),
    );
  }

  /// Menu tile for danger action (e.g., logout, delete)
  factory MenuTile.danger({
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return MenuTile(
      icon: icon,
      title: title,
      subtitle: subtitle,
      onTap: onTap,
      iconColor: AppColors.destructive,
      iconBackgroundColor: AppColors.destructive.withOpacity(0.1),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveIconColor = iconColor ?? AppColors.primary;
    final effectiveIconBgColor =
        iconBackgroundColor ?? effectiveIconColor.withOpacity(0.1);

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: padding ??
            const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
        child: Row(
          children: [
            // Icon
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: effectiveIconBgColor,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                color: effectiveIconColor,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),

            // Text content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: iconColor == AppColors.destructive
                          ? AppColors.destructive
                          : (isDark ? Colors.white : Colors.black87),
                    ),
                  ),
                  if (subtitle != null)
                    Text(
                      subtitle!,
                      style: TextStyle(
                        fontSize: 12,
                        color: iconColor == AppColors.destructive
                            ? AppColors.destructive.withOpacity(0.7)
                            : (isDark
                                ? AppColors.mutedForegroundDark
                                : AppColors.mutedForeground),
                      ),
                    ),
                ],
              ),
            ),

            // Trailing widget or chevron
            if (trailing != null)
              trailing!
            else if (showChevron && onTap != null)
              Icon(
                Icons.chevron_right,
                color: isDark
                    ? AppColors.mutedForegroundDark
                    : AppColors.mutedForeground,
              ),
          ],
        ),
      ),
    );
  }
}

/// Info tile (non-tappable, for displaying data)
class InfoTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final Color? iconColor;
  final EdgeInsets? padding;

  const InfoTile({
    super.key,
    required this.icon,
    required this.title,
    required this.value,
    this.iconColor,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveIconColor = iconColor ?? AppColors.primary;

    return Padding(
      padding: padding ??
          const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),
      child: Row(
        children: [
          Icon(
            icon,
            color: effectiveIconColor,
            size: 20,
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 12,
                  color: isDark
                      ? AppColors.mutedForegroundDark
                      : AppColors.mutedForeground,
                ),
              ),
              Text(
                value,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
