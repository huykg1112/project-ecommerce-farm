import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/localization/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../injection_container.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../../../cart/presentation/bloc/local_cart_bloc.dart';
import '../../../wishlist/domain/entities/wishlist_item.dart';
import '../../../wishlist/presentation/bloc/wishlist_bloc.dart';
import '../../../wishlist/presentation/bloc/wishlist_event.dart';
import '../../../wishlist/presentation/bloc/wishlist_state.dart';
import '../../domain/entities/product.dart';
import '../../domain/models/product_filter.dart';
import '../bloc/product_bloc.dart';
import '../bloc/product_event.dart';
import '../bloc/product_state.dart';
import '../widgets/product_card.dart';
import '../widgets/product_batch_selector.dart';
import '../widgets/product_filter_sheet.dart';
import '../widgets/product_search_bar.dart';
import '../widgets/product_sort_dropdown.dart';

class ProductsPage extends StatefulWidget {
  const ProductsPage({super.key});

  @override
  State<ProductsPage> createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  late TextEditingController _searchController;
  ProductFilter _filter = ProductFilter.empty;

  // Sample categories and stores for demo
  final List<Category> _categories = const [
    Category(id: '1', name: 'Chăm sóc hạt giống', productCount: 0),
    Category(id: '2', name: 'Thuốc Diệt Cỏ', productCount: 1),
    Category(id: '3', name: 'Thuốc trừ bệnh', productCount: 2),
    Category(id: '4', name: 'Thuốc trừ sâu', productCount: 0),
  ];

  final List<Store> _stores = const [
    Store(id: '1', name: 'Admin\'s Store'),
    Store(id: '2', name: 'Trần Hoàng Huy\'s Store'),
  ];

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    setState(() {
      _filter = _filter.copyWith(searchQuery: _searchController.text);
    });
  }

  void _openFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ProductFilterSheet(
        currentFilter: _filter,
        categories: _categories,
        stores: _stores,
        onApply: (newFilter) {
          setState(() {
            _filter = newFilter;
          });
        },
        onClear: () {
          setState(() {
            _filter = ProductFilter.empty;
            _searchController.clear();
          });
        },
      ),
    );
  }

  void _onSortChanged(ProductSortOption option) {
    setState(() {
      _filter = _filter.copyWith(sortBy: option);
    });
  }

  void _clearAllFilters() {
    setState(() {
      _filter = ProductFilter.empty;
      _searchController.clear();
    });
  }

  List<Product> _applyFilters(List<Product> products) {
    List<Product> filtered = List.from(products);

    // Apply search
    if (_filter.searchQuery.isNotEmpty) {
      final query = _filter.searchQuery.toLowerCase();
      filtered = filtered.where((p) {
        return p.productName.toLowerCase().contains(query) ||
            (p.description?.toLowerCase().contains(query) ?? false);
      }).toList();
    }

    // Apply category filter
    if (_filter.categories.isNotEmpty) {
      filtered = filtered.where((p) {
        return p.categories.any((c) => _filter.categories.contains(c));
      }).toList();
    }

    // Apply price filter
    filtered = filtered.where((p) {
      return p.unitPrice >= _filter.minPrice && p.unitPrice <= _filter.maxPrice;
    }).toList();

    // Apply rating filter
    if (_filter.minRating != null) {
      filtered = filtered.where((p) {
        return (p.averageRating ?? 0) >= _filter.minRating!;
      }).toList();
    }

    // Apply store filter
    if (_filter.storeIds.isNotEmpty) {
      filtered = filtered.where((p) {
        return p.storeId != null && _filter.storeIds.contains(p.storeId);
      }).toList();
    }

    // Apply on sale filter
    if (_filter.onSale) {
      filtered = filtered.where((p) => p.hasDiscount).toList();
    }

    // Apply sorting
    switch (_filter.sortBy) {
      case ProductSortOption.newest:
        filtered.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
      case ProductSortOption.priceAsc:
        filtered.sort((a, b) => a.unitPrice.compareTo(b.unitPrice));
        break;
      case ProductSortOption.priceDesc:
        filtered.sort((a, b) => b.unitPrice.compareTo(a.unitPrice));
        break;
      case ProductSortOption.rating:
        filtered.sort(
            (a, b) => (b.averageRating ?? 0).compareTo(a.averageRating ?? 0));
        break;
      case ProductSortOption.featured:
      default:
        // Keep original order or sort by sales
        filtered.sort((a, b) => b.totalSaled.compareTo(a.totalSaled));
        break;
    }

    return filtered;
  }

  void _addToCart(Product product) {
    // Check if product has valid batches for selection
    if (product.validBatches.isNotEmpty) {
      // Show batch selector bottom sheet
      ProductBatchSelector.show(
        context: context,
        product: product,
        onAddToCart: (batch, quantity) {
          // Create cart item with batch info
          final cartItem = LocalCartItem(
            id: '${product.productId}/${batch.batchId}',
            productId: product.productId,
            productName: product.productName,
            price: batch.unitPrice,
            discountValue: batch.discountPercentage != null
                ? (batch.unitPrice * batch.discountPercentage! / 100)
                : null,
            quantity: quantity,
            imageUrl:
                product.imageUrls.isNotEmpty ? product.imageUrls.first : '',
            sellerId: product.storeId ?? '',
            sellerName: product.storeName ?? 'Unknown',
            batchId: batch.batchId,
            batchName: batch.productType.typeName,
          );

          context.read<LocalCartBloc>().add(AddToLocalCart(cartItem));
          CustomSnackBar.showSuccess(
            context,
            message: 'Đã thêm $quantity ${product.productName} vào giỏ hàng',
          );
        },
      );
    } else {
      // No batches available - add directly with product price
      final cartItem = LocalCartItem(
        id: product.productId,
        productId: product.productId,
        productName: product.productName,
        price: product.unitPrice,
        discountValue: product.hasDiscount
            ? (product.originalPrice! - product.unitPrice)
            : null,
        quantity: 1,
        imageUrl: product.imageUrls.isNotEmpty ? product.imageUrls.first : '',
        sellerId: product.storeId ?? '',
        sellerName: product.storeName ?? 'Unknown',
      );

      context.read<LocalCartBloc>().add(AddToLocalCart(cartItem));
      CustomSnackBar.showSuccess(
        context,
        message: 'Đã thêm ${product.productName} vào giỏ hàng',
      );
    }
  }

  void _toggleWishlist(Product product) {
    final wishlistBloc = context.read<WishlistBloc>();
    final isInWishlist = wishlistBloc.isInWishlist(product.productId);

    final wishlistItem = WishlistItem(
      productId: product.productId,
      productName: product.productName,
      price: product.unitPrice,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      imageUrl: product.imageUrls.isNotEmpty ? product.imageUrls.first : null,
      storeName: product.storeName,
      rating: product.averageRating,
      addedAt: DateTime.now(),
    );

    wishlistBloc.add(ToggleWishlist(wishlistItem));

    if (isInWishlist) {
      CustomSnackBar.showInfo(
        context,
        message: 'Đã xóa ${product.productName} khỏi yêu thích',
      );
    } else {
      CustomSnackBar.showSuccess(
        context,
        message: 'Đã thêm ${product.productName} vào yêu thích',
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocProvider(
      create: (_) => sl<ProductBloc>()..add(const LoadProducts()),
      child: Scaffold(
        appBar: AppBar(
          title: Text(l10n.tr('products')),
          centerTitle: true,
          elevation: 0,
        ),
        body: Column(
          children: [
            // Search and Filter Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: ProductSearchBar(
                controller: _searchController,
                hintText: l10n.tr('search'),
                onFilterTap: _openFilterSheet,
                filterCount: _filter.activeFilterCount,
                onClear: () {
                  setState(() {
                    _filter = _filter.copyWith(searchQuery: '');
                  });
                },
              ),
            ),

            // Sort Dropdown
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Sắp xếp:',
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                  ProductSortDropdown(
                    currentSort: _filter.sortBy,
                    onChanged: _onSortChanged,
                    isVietnamese: l10n.isVietnamese,
                  ),
                ],
              ),
            ),

            // Active Filters Bar
            if (_filter.hasActiveFilters)
              ActiveFiltersBar(
                filter: _filter,
                categories: _categories,
                stores: _stores,
                onRemoveCategory: (cat) {
                  setState(() {
                    final newCats = List<String>.from(_filter.categories)
                      ..remove(cat);
                    _filter = _filter.copyWith(categories: newCats);
                  });
                },
                onRemoveStore: (storeId) {
                  setState(() {
                    final newStores = List<String>.from(_filter.storeIds)
                      ..remove(storeId);
                    _filter = _filter.copyWith(storeIds: newStores);
                  });
                },
                onRemoveRating: () {
                  setState(() {
                    _filter = _filter.copyWith(clearMinRating: true);
                  });
                },
                onRemoveOnSale: () {
                  setState(() {
                    _filter = _filter.copyWith(onSale: false);
                  });
                },
                onRemoveSearch: () {
                  _searchController.clear();
                  setState(() {
                    _filter = _filter.copyWith(searchQuery: '');
                  });
                },
                onRemovePriceRange: () {
                  setState(() {
                    _filter = _filter.copyWith(minPrice: 0, maxPrice: 5000000);
                  });
                },
                onClearAll: _clearAllFilters,
              ),

            // Product Grid
            Expanded(
              child: BlocBuilder<ProductBloc, ProductState>(
                builder: (context, state) {
                  if (state is ProductLoading) {
                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  }

                  if (state is ProductError) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error_outline,
                            size: 64,
                            color: isDark ? Colors.red[300] : Colors.red,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            state.message,
                            textAlign: TextAlign.center,
                            style: const TextStyle(fontSize: 16),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () {
                              context
                                  .read<ProductBloc>()
                                  .add(const LoadProducts());
                            },
                            child: Text(l10n.tr('retry')),
                          ),
                        ],
                      ),
                    );
                  }

                  if (state is ProductsLoaded) {
                    final filteredProducts = _applyFilters(state.products);

                    if (filteredProducts.isEmpty) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.search_off,
                              size: 64,
                              color:
                                  isDark ? Colors.grey[600] : Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              l10n.tr('no_data'),
                              style: TextStyle(
                                fontSize: 16,
                                color: isDark
                                    ? Colors.grey[400]
                                    : Colors.grey[600],
                              ),
                            ),
                            if (_filter.hasActiveFilters) ...[
                              const SizedBox(height: 16),
                              TextButton(
                                onPressed: _clearAllFilters,
                                child: const Text('Xóa bộ lọc'),
                              ),
                            ],
                          ],
                        ),
                      );
                    }

                    return RefreshIndicator(
                      onRefresh: () async {
                        context.read<ProductBloc>().add(const LoadProducts());
                      },
                      child: GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.58,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        itemCount: filteredProducts.length,
                        itemBuilder: (context, index) {
                          final product = filteredProducts[index];
                          return BlocBuilder<WishlistBloc, WishlistState>(
                            builder: (context, wishlistState) {
                              final isInWishlist =
                                  wishlistState is WishlistLoaded
                                      ? wishlistState
                                          .isInWishlist(product.productId)
                                      : false;
                              return ProductCard(
                                product: product,
                                isInWishlist: isInWishlist,
                                onTap: () {
                                  context
                                      .push('/products/${product.productId}');
                                },
                                onAddToCart: () => _addToCart(product),
                                onToggleWishlist: () =>
                                    _toggleWishlist(product),
                              );
                            },
                          );
                        },
                      ),
                    );
                  }

                  return const SizedBox();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Active filters bar widget (imported from sort_dropdown file)
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
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
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
                    'Giảm giá',
                    Icons.local_offer,
                    onRemoveOnSale,
                  ),
              ],
            ),
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
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primary.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.primary),
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
}
