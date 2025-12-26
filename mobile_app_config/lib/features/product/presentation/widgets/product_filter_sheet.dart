import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/models/product_filter.dart';

/// Filter bottom sheet for products
class ProductFilterSheet extends StatefulWidget {
  final ProductFilter currentFilter;
  final List<Category> categories;
  final List<Store> stores;
  final double minPrice;
  final double maxPrice;
  final Function(ProductFilter) onApply;
  final VoidCallback onClear;

  const ProductFilterSheet({
    super.key,
    required this.currentFilter,
    required this.categories,
    required this.stores,
    this.minPrice = 0,
    this.maxPrice = 5000000,
    required this.onApply,
    required this.onClear,
  });

  @override
  State<ProductFilterSheet> createState() => _ProductFilterSheetState();
}

class _ProductFilterSheetState extends State<ProductFilterSheet> {
  late ProductFilter _filter;
  late RangeValues _priceRange;

  @override
  void initState() {
    super.initState();
    _filter = widget.currentFilter;
    _priceRange = RangeValues(
      widget.currentFilter.minPrice,
      widget.currentFilter.maxPrice,
    );
  }

  void _toggleCategory(String categoryName) {
    final newCategories = List<String>.from(_filter.categories);
    if (newCategories.contains(categoryName)) {
      newCategories.remove(categoryName);
    } else {
      newCategories.add(categoryName);
    }
    setState(() {
      _filter = _filter.copyWith(categories: newCategories);
    });
  }

  void _toggleStore(String storeId) {
    final newStoreIds = List<String>.from(_filter.storeIds);
    if (newStoreIds.contains(storeId)) {
      newStoreIds.remove(storeId);
    } else {
      newStoreIds.add(storeId);
    }
    setState(() {
      _filter = _filter.copyWith(storeIds: newStoreIds);
    });
  }

  void _setRating(int? rating) {
    setState(() {
      if (rating == null) {
        _filter = _filter.copyWith(clearMinRating: true);
      } else {
        _filter = _filter.copyWith(minRating: rating);
      }
    });
  }

  void _toggleOnSale() {
    setState(() {
      _filter = _filter.copyWith(onSale: !_filter.onSale);
    });
  }

  String _formatPrice(double price) {
    if (price >= 1000000) {
      return '${(price / 1000000).toStringAsFixed(1)}M';
    } else if (price >= 1000) {
      return '${(price / 1000).toStringAsFixed(0)}K';
    }
    return price.toStringAsFixed(0);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[400],
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Bộ lọc sản phẩm',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _filter = ProductFilter.empty;
                      _priceRange =
                          RangeValues(widget.minPrice, widget.maxPrice);
                    });
                  },
                  child: const Text('Xóa tất cả'),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Filter Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Categories Section
                  _buildSectionTitle('Danh mục'),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.categories.map((category) {
                      final isSelected =
                          _filter.categories.contains(category.name);
                      return FilterChip(
                        label: Text(
                          '${category.name} (${category.productCount})',
                          style: TextStyle(
                            color: isSelected
                                ? Colors.white
                                : (isDark ? Colors.white70 : Colors.black87),
                            fontSize: 13,
                          ),
                        ),
                        selected: isSelected,
                        onSelected: (_) => _toggleCategory(category.name),
                        selectedColor: AppColors.primary,
                        backgroundColor:
                            isDark ? AppColors.cardDark : Colors.grey[100],
                        checkmarkColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: isSelected
                                ? AppColors.primary
                                : (isDark
                                    ? AppColors.borderDark
                                    : Colors.grey[300]!),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 24),

                  // Price Range Section
                  _buildSectionTitle(
                    'Khoảng giá: ${_formatPrice(_priceRange.start)} - ${_formatPrice(_priceRange.end)} đ',
                  ),
                  RangeSlider(
                    values: _priceRange,
                    min: widget.minPrice,
                    max: widget.maxPrice,
                    divisions: 50,
                    activeColor: AppColors.primary,
                    inactiveColor: isDark ? Colors.grey[700] : Colors.grey[300],
                    onChanged: (values) {
                      setState(() {
                        _priceRange = values;
                        _filter = _filter.copyWith(
                          minPrice: values.start,
                          maxPrice: values.end,
                        );
                      });
                    },
                  ),

                  const SizedBox(height: 24),

                  // Rating Section
                  _buildSectionTitle('Đánh giá'),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [5, 4, 3, 2, 1].map((rating) {
                      final isSelected = _filter.minRating == rating;
                      return ChoiceChip(
                        label: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            ...List.generate(
                              rating,
                              (_) => const Icon(
                                Icons.star,
                                size: 14,
                                color: Colors.amber,
                              ),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'trở lên',
                              style: TextStyle(
                                fontSize: 12,
                                color: isSelected
                                    ? Colors.white
                                    : (isDark
                                        ? Colors.white70
                                        : Colors.black87),
                              ),
                            ),
                          ],
                        ),
                        selected: isSelected,
                        onSelected: (_) =>
                            _setRating(isSelected ? null : rating),
                        selectedColor: AppColors.primary,
                        backgroundColor:
                            isDark ? AppColors.cardDark : Colors.grey[100],
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: isSelected
                                ? AppColors.primary
                                : (isDark
                                    ? AppColors.borderDark
                                    : Colors.grey[300]!),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 24),

                  // Stores Section
                  if (widget.stores.isNotEmpty) ...[
                    _buildSectionTitle('Đại lý'),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: widget.stores.map((store) {
                        final isSelected = _filter.storeIds.contains(store.id);
                        return FilterChip(
                          label: Text(
                            store.name,
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : (isDark ? Colors.white70 : Colors.black87),
                              fontSize: 13,
                            ),
                          ),
                          selected: isSelected,
                          onSelected: (_) => _toggleStore(store.id),
                          selectedColor: AppColors.primary,
                          backgroundColor:
                              isDark ? AppColors.cardDark : Colors.grey[100],
                          checkmarkColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected
                                  ? AppColors.primary
                                  : (isDark
                                      ? AppColors.borderDark
                                      : Colors.grey[300]!),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Other Section
                  _buildSectionTitle('Khác'),
                  FilterChip(
                    label: Text(
                      'Đang giảm giá',
                      style: TextStyle(
                        color: _filter.onSale
                            ? Colors.white
                            : (isDark ? Colors.white70 : Colors.black87),
                        fontSize: 13,
                      ),
                    ),
                    avatar: Icon(
                      Icons.local_offer,
                      size: 18,
                      color:
                          _filter.onSale ? Colors.white : AppColors.destructive,
                    ),
                    selected: _filter.onSale,
                    onSelected: (_) => _toggleOnSale(),
                    selectedColor: AppColors.destructive,
                    backgroundColor:
                        isDark ? AppColors.cardDark : Colors.grey[100],
                    checkmarkColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: _filter.onSale
                            ? AppColors.destructive
                            : (isDark
                                ? AppColors.borderDark
                                : Colors.grey[300]!),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),

          // Apply Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.cardDark : Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    widget.onApply(_filter);
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Áp dụng (${_filter.activeFilterCount} bộ lọc)',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
