import 'package:equatable/equatable.dart';

/// Sorting options for products
enum ProductSortOption {
  featured,
  newest,
  priceAsc,
  priceDesc,
  rating,
}

/// Extension to get display name for sort options
extension ProductSortOptionExtension on ProductSortOption {
  String getDisplayName({bool isVietnamese = true}) {
    switch (this) {
      case ProductSortOption.featured:
        return isVietnamese ? 'Nổi bật' : 'Featured';
      case ProductSortOption.newest:
        return isVietnamese ? 'Mới nhất' : 'Newest';
      case ProductSortOption.priceAsc:
        return isVietnamese ? 'Giá thấp → cao' : 'Price: Low to High';
      case ProductSortOption.priceDesc:
        return isVietnamese ? 'Giá cao → thấp' : 'Price: High to Low';
      case ProductSortOption.rating:
        return isVietnamese ? 'Đánh giá cao' : 'Highest Rating';
    }
  }
}

/// Product filter state
class ProductFilter extends Equatable {
  final List<String> categories;
  final double minPrice;
  final double maxPrice;
  final int? minRating;
  final List<String> storeIds;
  final bool onSale;
  final String searchQuery;
  final ProductSortOption sortBy;

  const ProductFilter({
    this.categories = const [],
    this.minPrice = 0,
    this.maxPrice = 5000000, // 5 million VND default max
    this.minRating,
    this.storeIds = const [],
    this.onSale = false,
    this.searchQuery = '',
    this.sortBy = ProductSortOption.featured,
  });

  /// Check if any filter is active
  bool get hasActiveFilters =>
      categories.isNotEmpty ||
      minRating != null ||
      storeIds.isNotEmpty ||
      onSale ||
      searchQuery.isNotEmpty ||
      minPrice > 0 ||
      maxPrice < 5000000;

  /// Count of active filters
  int get activeFilterCount {
    int count = 0;
    count += categories.length;
    if (minRating != null) count++;
    count += storeIds.length;
    if (onSale) count++;
    if (searchQuery.isNotEmpty) count++;
    if (minPrice > 0 || maxPrice < 5000000) count++;
    return count;
  }

  /// Create a copy with updated values
  ProductFilter copyWith({
    List<String>? categories,
    double? minPrice,
    double? maxPrice,
    int? minRating,
    bool clearMinRating = false,
    List<String>? storeIds,
    bool? onSale,
    String? searchQuery,
    ProductSortOption? sortBy,
  }) {
    return ProductFilter(
      categories: categories ?? this.categories,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      minRating: clearMinRating ? null : (minRating ?? this.minRating),
      storeIds: storeIds ?? this.storeIds,
      onSale: onSale ?? this.onSale,
      searchQuery: searchQuery ?? this.searchQuery,
      sortBy: sortBy ?? this.sortBy,
    );
  }

  /// Reset all filters to default
  static const ProductFilter empty = ProductFilter();

  @override
  List<Object?> get props => [
        categories,
        minPrice,
        maxPrice,
        minRating,
        storeIds,
        onSale,
        searchQuery,
        sortBy,
      ];
}

/// Category model for filtering
class Category extends Equatable {
  final String id;
  final String name;
  final int productCount;

  const Category({
    required this.id,
    required this.name,
    this.productCount = 0,
  });

  @override
  List<Object?> get props => [id, name, productCount];
}

/// Store model for filtering
class Store extends Equatable {
  final String id;
  final String name;

  const Store({
    required this.id,
    required this.name,
  });

  @override
  List<Object?> get props => [id, name];
}
