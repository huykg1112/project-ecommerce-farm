import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

/// Reusable search input widget
class SearchInput extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onClear;
  final VoidCallback? onSubmit;
  final Widget? suffixWidget;
  final double height;
  final double borderRadius;
  final bool autofocus;
  final FocusNode? focusNode;

  const SearchInput({
    super.key,
    this.controller,
    this.hintText,
    this.onChanged,
    this.onClear,
    this.onSubmit,
    this.suffixWidget,
    this.height = 48,
    this.borderRadius = 12,
    this.autofocus = false,
    this.focusNode,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      height: height,
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.grey[100],
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: isDark ? AppColors.borderDark : Colors.grey[300]!,
        ),
      ),
      child: Row(
        children: [
          // Search Icon
          Padding(
            padding: const EdgeInsets.only(left: 12),
            child: Icon(
              Icons.search,
              color: isDark ? Colors.grey[500] : Colors.grey[600],
              size: 22,
            ),
          ),

          // Search Input
          Expanded(
            child: TextField(
              controller: controller,
              focusNode: focusNode,
              autofocus: autofocus,
              onChanged: onChanged,
              onSubmitted: (_) => onSubmit?.call(),
              decoration: InputDecoration(
                hintText: hintText ?? 'Tìm kiếm...',
                hintStyle: TextStyle(
                  color: isDark ? Colors.grey[500] : Colors.grey[600],
                  fontSize: 14,
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 14,
                ),
              ),
              style: TextStyle(
                fontSize: 14,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
          ),

          // Clear Button
          if (controller != null && controller!.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.close, size: 20),
              onPressed: () {
                controller?.clear();
                onClear?.call();
              },
              color: Colors.grey,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(
                minWidth: 36,
                minHeight: 36,
              ),
            ),

          // Suffix Widget
          if (suffixWidget != null)
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: suffixWidget,
            ),
        ],
      ),
    );
  }
}

/// Search input with filter button
class SearchInputWithFilter extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onClear;
  final VoidCallback? onFilterTap;
  final int filterCount;

  const SearchInputWithFilter({
    super.key,
    this.controller,
    this.hintText,
    this.onChanged,
    this.onClear,
    this.onFilterTap,
    this.filterCount = 0,
  });

  @override
  Widget build(BuildContext context) {
    return SearchInput(
      controller: controller,
      hintText: hintText,
      onChanged: onChanged,
      onClear: onClear,
      suffixWidget: _buildFilterButton(context),
    );
  }

  Widget _buildFilterButton(BuildContext context) {
    return Stack(
      children: [
        IconButton(
          icon: const Icon(Icons.tune, size: 22),
          onPressed: onFilterTap,
          color: AppColors.primary,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(
            minWidth: 40,
            minHeight: 40,
          ),
        ),
        // Filter count badge
        if (filterCount > 0)
          Positioned(
            right: 4,
            top: 4,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                color: AppColors.destructive,
                shape: BoxShape.circle,
              ),
              constraints: const BoxConstraints(
                minWidth: 16,
                minHeight: 16,
              ),
              child: Text(
                filterCount.toString(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }
}
