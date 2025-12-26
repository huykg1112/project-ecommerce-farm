import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/models/product_filter.dart';

/// Sort dropdown for products
class ProductSortDropdown extends StatelessWidget {
  final ProductSortOption currentSort;
  final ValueChanged<ProductSortOption> onChanged;
  final bool isVietnamese;

  const ProductSortDropdown({
    super.key,
    required this.currentSort,
    required this.onChanged,
    this.isVietnamese = true,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isDark ? AppColors.borderDark : Colors.grey[300]!,
        ),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<ProductSortOption>(
          value: currentSort,
          icon: const Icon(Icons.keyboard_arrow_down, size: 20),
          isDense: true,
          dropdownColor: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(12),
          style: TextStyle(
            fontSize: 13,
            color: isDark ? Colors.white : Colors.black87,
          ),
          items: ProductSortOption.values.map((option) {
            return DropdownMenuItem(
              value: option,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    _getIconForOption(option),
                    size: 16,
                    color: AppColors.primary,
                  ),
                  const SizedBox(width: 8),
                  Text(option.getDisplayName(isVietnamese: isVietnamese)),
                ],
              ),
            );
          }).toList(),
          onChanged: (value) {
            if (value != null) {
              onChanged(value);
            }
          },
        ),
      ),
    );
  }

  IconData _getIconForOption(ProductSortOption option) {
    switch (option) {
      case ProductSortOption.featured:
        return Icons.star_border;
      case ProductSortOption.newest:
        return Icons.schedule;
      case ProductSortOption.priceAsc:
        return Icons.arrow_upward;
      case ProductSortOption.priceDesc:
        return Icons.arrow_downward;
      case ProductSortOption.rating:
        return Icons.thumb_up_alt_outlined;
    }
  }
}

/// Active filters bar showing applied filters as chips
class ActiveFiltersBar extends StatelessWidget {
  final ProductFilter filter;
  final List<Category> categories;
  final List<Store> stores;
  final Function(String) onRemoveCategory;
  final Function(String) onRemoveStore;
  final VoidCallback? onRemoveRating;
  final VoidCallback? onRemoveOnSale;
  final VoidCallback? onRemoveSearch;
  final VoidCallback? onRemovePriceRange;
  final VoidCallback? onClearAll;

  const ActiveFiltersBar({
    super.key,
    required this.filter,
    required this.categories,
    required this.stores,
    required this.onRemoveCategory,
    required this.onRemoveStore,
    this.onRemoveRating,
    this.onRemoveOnSale,
    this.onRemoveSearch,
    this.onRemovePriceRange,
    this.onClearAll,
  });

  @override
  Widget build(BuildContext context) {
    if (!filter.hasActiveFilters) {
      return const SizedBox.shrink();
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Bộ lọc đang áp dụng:',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark ? Colors.grey[400] : Colors.grey[600],
                ),
              ),
              if (onClearAll != null)
                GestureDetector(
                  onTap: onClearAll,
                  child: Text(
                    'Xóa tất cả',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              // Search query
              if (filter.searchQuery.isNotEmpty)
                _buildChip(
                  context,
                  'Tìm: ${filter.searchQuery}',
                  Icons.search,
                  onRemoveSearch,
                ),

              // Categories
              ...filter.categories.map((cat) => _buildChip(
                    context,
                    cat,
                    Icons.category,
                    () => onRemoveCategory(cat),
                  )),

              // Rating
              if (filter.minRating != null)
                _buildChip(
                  context,
                  '${filter.minRating}+ sao',
                  Icons.star,
                  onRemoveRating,
                ),

              // Stores
              ...filter.storeIds.map((storeId) {
                final store = stores.firstWhere(
                  (s) => s.id == storeId,
                  orElse: () => Store(id: storeId, name: storeId),
                );
                return _buildChip(
                  context,
                  store.name,
                  Icons.store,
                  () => onRemoveStore(storeId),
                );
              }),

              // On sale
              if (filter.onSale)
                _buildChip(
                  context,
                  'Đang giảm giá',
                  Icons.local_offer,
                  onRemoveOnSale,
                ),

              // Price range
              if (filter.minPrice > 0 || filter.maxPrice < 5000000)
                _buildChip(
                  context,
                  '${_formatPrice(filter.minPrice)} - ${_formatPrice(filter.maxPrice)}',
                  Icons.attach_money,
                  onRemovePriceRange,
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChip(
    BuildContext context,
    String label,
    IconData icon,
    VoidCallback? onRemove,
  ) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primary.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: AppColors.primary,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white : AppColors.primary,
            ),
          ),
          if (onRemove != null) ...[
            const SizedBox(width: 4),
            GestureDetector(
              onTap: onRemove,
              child: Icon(
                Icons.close,
                size: 14,
                color: isDark ? Colors.white70 : AppColors.primary,
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _formatPrice(double price) {
    if (price >= 1000000) {
      return '${(price / 1000000).toStringAsFixed(1)}M';
    } else if (price >= 1000) {
      return '${(price / 1000).toStringAsFixed(0)}K';
    }
    return '${price.toStringAsFixed(0)}đ';
  }
}
