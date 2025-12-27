import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/localization/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/common/bottom_action_bar.dart';
import '../../../../shared/widgets/common/cached_image.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../../../../shared/widgets/common/price_display.dart';
import '../../../../shared/widgets/common/quantity_selector.dart';
import '../../../../shared/widgets/common/rating_stars.dart';
import '../../../../shared/widgets/loading/loading_widget.dart';
import '../../../../shared/widgets/states/error_state_view.dart';
import '../../../cart/presentation/bloc/local_cart_bloc.dart';
import '../../../wishlist/domain/entities/wishlist_item.dart';
import '../../../wishlist/presentation/bloc/wishlist_bloc.dart';
import '../../../wishlist/presentation/bloc/wishlist_event.dart';
import '../../../wishlist/presentation/bloc/wishlist_state.dart';
import '../../domain/entities/product.dart';
import '../../domain/entities/product_batch.dart';
import '../bloc/product_bloc.dart';
import '../bloc/product_event.dart';
import '../bloc/product_state.dart';

/// Product Detail Page - uses common components for consistency
class ProductDetailPage extends StatefulWidget {
  final String productId;

  const ProductDetailPage({
    super.key,
    required this.productId,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage>
    with SingleTickerProviderStateMixin {
  final PageController _imagePageController = PageController();
  int _currentImageIndex = 0;
  int _quantity = 1;
  late TabController _tabController;
  ProductBatch? _selectedBatch;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    context.read<ProductBloc>().add(LoadProductDetail(widget.productId));
  }

  @override
  void dispose() {
    _imagePageController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _selectBatch(ProductBatch batch) {
    setState(() {
      _selectedBatch = batch;
      if (_quantity > batch.quantity) {
        _quantity = batch.quantity;
      }
    });
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

    final l10n = AppLocalizations.of(context);
    if (isInWishlist) {
      CustomSnackBar.showInfo(
        context,
        message: l10n.isVietnamese
            ? 'Đã xóa khỏi yêu thích'
            : 'Removed from wishlist',
      );
    } else {
      CustomSnackBar.showSuccess(
        context,
        message:
            l10n.isVietnamese ? 'Đã thêm vào yêu thích' : 'Added to wishlist',
      );
    }
  }

  double _getDisplayPrice(Product product) {
    return _selectedBatch?.finalPrice ?? product.displayPrice;
  }

  double? _getOriginalPrice(Product product) {
    if (_selectedBatch?.discountPercentage != null) {
      return _selectedBatch!.unitPrice;
    }
    return product.strikethroughPrice;
  }

  double? _getDiscountPercentage(Product product) {
    return _selectedBatch?.discountPercentage ?? product.discountPercentage;
  }

  void _addToCart(Product product) {
    if (_selectedBatch != null) {
      final cartItem = LocalCartItem(
        id: '${product.productId}/${_selectedBatch!.batchId}',
        productId: product.productId,
        productName: product.productName,
        price: _selectedBatch!.unitPrice,
        discountValue: _selectedBatch!.discountPercentage != null
            ? (_selectedBatch!.unitPrice *
                _selectedBatch!.discountPercentage! /
                100)
            : null,
        quantity: _quantity,
        imageUrl: product.imageUrls.isNotEmpty ? product.imageUrls.first : '',
        sellerId: product.storeId ?? '',
        sellerName: product.storeName ?? 'Unknown',
        batchId: _selectedBatch!.batchId,
        batchName: _selectedBatch!.productType.typeName,
      );
      context.read<LocalCartBloc>().add(AddToLocalCart(cartItem));
      CustomSnackBar.showSuccess(context,
          message: 'Đã thêm $_quantity sản phẩm vào giỏ hàng');
    } else if (product.validBatches.isNotEmpty) {
      CustomSnackBar.showInfo(context, message: 'Vui lòng chọn loại sản phẩm');
    } else {
      final cartItem = LocalCartItem(
        id: '${product.productId}_${DateTime.now().millisecondsSinceEpoch}',
        productId: product.productId,
        productName: product.productName,
        price: product.unitPrice,
        discountValue: product.hasDiscount
            ? (product.originalPrice! - product.unitPrice)
            : null,
        quantity: _quantity,
        imageUrl: product.imageUrls.isNotEmpty ? product.imageUrls.first : '',
        sellerId: product.storeId ?? '',
        sellerName: product.storeName ?? 'Unknown',
      );
      context.read<LocalCartBloc>().add(AddToLocalCart(cartItem));
      CustomSnackBar.showSuccess(context,
          message: 'Đã thêm $_quantity sản phẩm vào giỏ hàng');
    }
  }

  void _buyNow(Product product) {
    _addToCart(product);
    context.push('/cart');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<ProductBloc, ProductState>(
        builder: (context, state) {
          if (state is ProductLoading) {
            return const LoadingWidget(message: 'Đang tải...');
          }
          if (state is ProductError) {
            return ErrorStateView.genericError(
              message: state.message,
              onRetry: () => context
                  .read<ProductBloc>()
                  .add(LoadProductDetail(widget.productId)),
            );
          }
          if (state is ProductDetailLoaded) {
            if (_selectedBatch == null &&
                state.product.validBatches.isNotEmpty) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                setState(
                    () => _selectedBatch = state.product.validBatches.first);
              });
            }
            return _buildContent(context, state.product);
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildContent(BuildContext context, Product product) {
    return Stack(
      children: [
        CustomScrollView(
          slivers: [
            _buildSliverAppBar(product),
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildProductHeader(product),
                  if (product.validBatches.isNotEmpty)
                    _buildBatchSelector(product),
                  if (product.storeName != null) _buildStoreInfo(product),
                  const Divider(height: 1),
                  _buildRatingSection(product),
                  const Divider(height: 1),
                  _buildQuantitySection(product),
                  const Divider(height: 1),
                  _buildFeaturesSection(),
                  const Divider(height: 1),
                  _buildTabSection(product),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ],
        ),
        _buildBottomBar(product),
      ],
    );
  }

  Widget _buildSliverAppBar(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final discount = _getDiscountPercentage(product);

    return SliverAppBar(
      expandedHeight: 350,
      pinned: true,
      backgroundColor: isDark ? AppColors.backgroundDark : Colors.white,
      leading: _CircleIconButton(
        icon: Icons.arrow_back,
        onPressed: () => context.pop(),
      ),
      actions: [
        BlocBuilder<WishlistBloc, WishlistState>(
          builder: (context, state) {
            final isInWishlist = state is WishlistLoaded &&
                state.isInWishlist(product.productId);
            return _CircleIconButton(
              icon: isInWishlist ? Icons.favorite : Icons.favorite_border,
              iconColor: isInWishlist ? AppColors.destructive : null,
              onPressed: () => _toggleWishlist(product),
            );
          },
        ),
        _buildCartButton(),
        _CircleIconButton(icon: Icons.share_outlined, onPressed: () {}),
        const SizedBox(width: 8),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: _ImageGallery(
          images: product.imageUrls,
          currentIndex: _currentImageIndex,
          onPageChanged: (i) => setState(() => _currentImageIndex = i),
          discountPercentage: discount,
        ),
      ),
    );
  }

  Widget _buildCartButton() {
    return BlocBuilder<LocalCartBloc, LocalCartState>(
      builder: (context, state) {
        final count = state is LocalCartLoaded ? state.totalItems : 0;
        return Stack(
          children: [
            _CircleIconButton(
              icon: Icons.shopping_cart_outlined,
              onPressed: () => context.push('/cart'),
            ),
            if (count > 0)
              Positioned(
                right: 4,
                top: 4,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                      color: AppColors.destructive, shape: BoxShape.circle),
                  child: Text(
                    count > 99 ? '99+' : '$count',
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  Widget _buildProductHeader(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final displayPrice = _getDisplayPrice(product);
    final originalPrice = _getOriginalPrice(product);
    final discount = _getDiscountPercentage(product);

    return Container(
      padding: const EdgeInsets.all(16),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (product.categories.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Wrap(
                spacing: 8,
                children: product.categories
                    .take(3)
                    .map((cat) => _CategoryChip(label: cat))
                    .toList(),
              ),
            ),
          Text(
            product.productName,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              PriceDisplay(
                price: displayPrice,
                originalPrice: originalPrice,
                discountPercentage: discount,
                priceStyle: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary),
              ),
              if (discount != null && discount > 0) ...[
                const SizedBox(width: 8),
                _DiscountBadge(percentage: discount),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBatchSelector(Product product) {
    return ProductBatchSelectorInline(
      batches: product.validBatches,
      selectedBatch: _selectedBatch,
      onBatchSelected: _selectBatch,
    );
  }

  Widget _buildStoreInfo(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.store, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.storeName!,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 4),
                Text('Xem cửa hàng',
                    style: TextStyle(fontSize: 13, color: AppColors.primary)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.mutedForeground),
        ],
      ),
    );
  }

  Widget _buildRatingSection(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Row(
        children: [
          if (product.averageRating != null) ...[
            RatingStars(
                rating: product.averageRating!,
                showValue: true,
                reviewCount: product.reviewCount),
            const SizedBox(width: 16),
          ],
          Icon(Icons.shopping_bag_outlined,
              size: 18, color: isDark ? Colors.grey[400] : Colors.grey[600]),
          const SizedBox(width: 4),
          Text(
            'Đã bán ${_formatSoldCount(product.totalSaled)}',
            style: TextStyle(
                fontSize: 13,
                color: isDark ? Colors.grey[400] : Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  String _formatSoldCount(int count) =>
      count >= 1000 ? '${(count / 1000).toStringAsFixed(1)}k' : '$count';

  Widget _buildQuantitySection(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final maxStock = _selectedBatch?.quantity ?? 999;
    return Container(
      padding: const EdgeInsets.all(16),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Row(
        children: [
          Text('Số lượng',
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: isDark ? Colors.white : Colors.black87)),
          const Spacer(),
          QuantitySelector(
            quantity: _quantity,
            onIncrement: () {
              if (_quantity < maxStock) setState(() => _quantity++);
            },
            onDecrement: () {
              if (_quantity > 1) setState(() => _quantity--);
            },
            maxQuantity: maxStock,
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturesSection() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _FeatureItem(
              icon: Icons.local_shipping_outlined, label: 'Miễn phí ship'),
          _FeatureItem(icon: Icons.verified_user_outlined, label: 'Chính hãng'),
          _FeatureItem(icon: Icons.replay_outlined, label: 'Đổi trả 7 ngày'),
        ],
      ),
    );
  }

  Widget _buildTabSection(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(top: 8),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Column(
        children: [
          TabBar(
            controller: _tabController,
            labelColor: AppColors.primary,
            unselectedLabelColor: isDark ? Colors.grey[400] : Colors.grey[600],
            indicatorColor: AppColors.primary,
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            tabs: const [
              Tab(text: 'Mô tả'),
              Tab(text: 'Thành phần'),
              Tab(text: 'Hướng dẫn'),
              Tab(text: 'Đặc trị'),
              Tab(text: 'Đánh giá'),
            ],
          ),
          SizedBox(
            height: 320,
            child: TabBarView(
              controller: _tabController,
              children: [
                _DescriptionTab(product: product),
                _IngredientsTab(product: product),
                _UsageInstructionsTab(product: product),
                _TargetedDiseasesTab(product: product),
                _ReviewsTab(product: product),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(Product product) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: BottomActionBar(
        leadingWidget: ActionBarIconButton(
            icon: Icons.chat_bubble_outline, onPressed: () {}),
        actions: [
          ActionButton.secondary(
            label: 'Thêm vào giỏ',
            icon: Icons.add_shopping_cart,
            onPressed: () => _addToCart(product),
          ),
          ActionButton.primary(
            label: 'Mua ngay',
            onPressed: () => _buyNow(product),
          ),
        ],
      ),
    );
  }
}

// ==================== REUSABLE WIDGETS ====================

class _CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final Color? iconColor;

  const _CircleIconButton({required this.icon, this.onPressed, this.iconColor});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.all(4),
      child: Container(
        decoration: BoxDecoration(
          color: (isDark ? Colors.black : Colors.white).withOpacity(0.85),
          shape: BoxShape.circle,
        ),
        child: IconButton(
          icon: Icon(icon,
              color: iconColor ?? (isDark ? Colors.white : Colors.black87),
              size: 22),
          onPressed: onPressed,
        ),
      ),
    );
  }
}

class _ImageGallery extends StatelessWidget {
  final List<String> images;
  final int currentIndex;
  final ValueChanged<int> onPageChanged;
  final double? discountPercentage;

  const _ImageGallery(
      {required this.images,
      required this.currentIndex,
      required this.onPageChanged,
      this.discountPercentage});

  @override
  Widget build(BuildContext context) {
    if (images.isEmpty) {
      return Container(
        color: AppColors.muted,
        child: const Center(
            child: Icon(Icons.image_not_supported,
                size: 64, color: AppColors.mutedForeground)),
      );
    }
    return Stack(
      children: [
        PageView.builder(
          itemCount: images.length,
          onPageChanged: onPageChanged,
          itemBuilder: (_, i) => CachedImage.product(
              imageUrl: images[i],
              width: double.infinity,
              height: double.infinity),
        ),
        if (discountPercentage != null && discountPercentage! > 0)
          Positioned(
            top: 100,
            left: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                    colors: [Color(0xFFFF416C), Color(0xFFFF4B2B)]),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text('-${discountPercentage!.toInt()}%',
                  style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        if (images.length > 1)
          Positioned(
            bottom: 16,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                images.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: currentIndex == i ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: currentIndex == i
                        ? AppColors.primary
                        : Colors.white.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final String label;
  const _CategoryChip({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16)),
      child: Text(label,
          style: const TextStyle(
              fontSize: 12,
              color: AppColors.primary,
              fontWeight: FontWeight.w500)),
    );
  }
}

class _DiscountBadge extends StatelessWidget {
  final double percentage;
  const _DiscountBadge({required this.percentage});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
          color: AppColors.destructive.withOpacity(0.1),
          borderRadius: BorderRadius.circular(4)),
      child: Text('-${percentage.toInt()}%',
          style: const TextStyle(
              fontSize: 12,
              color: AppColors.destructive,
              fontWeight: FontWeight.bold)),
    );
  }
}

class _FeatureItem extends StatelessWidget {
  final IconData icon;
  final String label;
  const _FeatureItem({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              shape: BoxShape.circle),
          child: Icon(icon, size: 22, color: AppColors.primary),
        ),
        const SizedBox(height: 8),
        Text(label,
            style: TextStyle(
                fontSize: 11,
                color: isDark ? Colors.grey[400] : Colors.grey[600])),
      ],
    );
  }
}

class _DescriptionTab extends StatelessWidget {
  final Product product;
  const _DescriptionTab({required this.product});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Text(
        product.description ?? 'Không có mô tả',
        style: TextStyle(
            fontSize: 14,
            height: 1.6,
            color: isDark ? Colors.grey[300] : Colors.grey[700]),
      ),
    );
  }
}

class _IngredientsTab extends StatelessWidget {
  final Product product;
  const _IngredientsTab({required this.product});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final hasIngredients = product.productIngredients.isNotEmpty;

    if (!hasIngredients) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.science_outlined,
                size: 48, color: isDark ? Colors.grey[500] : Colors.grey[400]),
            const SizedBox(height: 16),
            Text('Chưa có thông tin thành phần',
                style: TextStyle(
                    color: isDark ? Colors.grey[400] : Colors.grey[600])),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.science, color: AppColors.primary, size: 20),
              const SizedBox(width: 8),
              Text(
                'Thành phần hoạt chất',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...product.productIngredients.map((pi) => _IngredientItem(
                name: pi.ingredient.ingredientName,
                description: pi.ingredient.description,
                isPrimary: pi.isPrimary,
                isDark: isDark,
              )),
        ],
      ),
    );
  }
}

class _IngredientItem extends StatelessWidget {
  final String name;
  final String? description;
  final bool isPrimary;
  final bool isDark;

  const _IngredientItem({
    required this.name,
    this.description,
    required this.isPrimary,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isPrimary
            ? AppColors.primary.withOpacity(0.1)
            : (isDark ? Colors.grey[800] : Colors.grey[100]),
        borderRadius: BorderRadius.circular(10),
        border:
            isPrimary ? Border.all(color: AppColors.primary, width: 1.5) : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            isPrimary ? Icons.star : Icons.circle,
            size: isPrimary ? 18 : 8,
            color: isPrimary ? AppColors.primary : AppColors.mutedForeground,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        name,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight:
                              isPrimary ? FontWeight.bold : FontWeight.w500,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                      ),
                    ),
                    if (isPrimary)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'Chính',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                if (description != null && description!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    description!,
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
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

class _UsageInstructionsTab extends StatelessWidget {
  final Product product;
  const _UsageInstructionsTab({required this.product});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final hasInstructions = product.usageInstructions != null &&
        product.usageInstructions!.isNotEmpty;

    if (!hasInstructions) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.menu_book_outlined,
                size: 48, color: isDark ? Colors.grey[500] : Colors.grey[400]),
            const SizedBox(height: 16),
            Text('Chưa có hướng dẫn sử dụng',
                style: TextStyle(
                    color: isDark ? Colors.grey[400] : Colors.grey[600])),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.menu_book, color: AppColors.primary, size: 20),
              const SizedBox(width: 8),
              Text(
                'Hướng dẫn sử dụng',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            product.usageInstructions!,
            style: TextStyle(
              fontSize: 14,
              height: 1.6,
              color: isDark ? Colors.grey[300] : Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }
}

class _TargetedDiseasesTab extends StatelessWidget {
  final Product product;
  const _TargetedDiseasesTab({required this.product});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final hasDiseases = product.productDiseases.isNotEmpty;

    if (!hasDiseases) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.healing_outlined,
                size: 48, color: isDark ? Colors.grey[500] : Colors.grey[400]),
            const SizedBox(height: 16),
            Text('Chưa có thông tin đặc trị',
                style: TextStyle(
                    color: isDark ? Colors.grey[400] : Colors.grey[600])),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.healing, color: AppColors.primary, size: 20),
              const SizedBox(width: 8),
              Text(
                'Đặc trị bệnh',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...product.productDiseases.map((pd) => _DiseaseItem(
                name: pd.disease.diseaseName,
                description: pd.disease.description,
                isPrimary: pd.isPrimary,
                isDark: isDark,
              )),
        ],
      ),
    );
  }
}

class _DiseaseItem extends StatelessWidget {
  final String name;
  final String? description;
  final bool isPrimary;
  final bool isDark;

  const _DiseaseItem({
    required this.name,
    this.description,
    required this.isPrimary,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isPrimary
            ? AppColors.destructive.withOpacity(0.1)
            : (isDark ? Colors.grey[800] : Colors.grey[100]),
        borderRadius: BorderRadius.circular(10),
        border: isPrimary
            ? Border.all(color: AppColors.destructive, width: 1.5)
            : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            isPrimary ? Icons.bug_report : Icons.circle,
            size: isPrimary ? 18 : 8,
            color:
                isPrimary ? AppColors.destructive : AppColors.mutedForeground,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        name,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight:
                              isPrimary ? FontWeight.bold : FontWeight.w500,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                      ),
                    ),
                    if (isPrimary)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.destructive,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'Đặc trị',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                if (description != null && description!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    description!,
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
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

class _ReviewsTab extends StatelessWidget {
  final Product product;
  const _ReviewsTab({required this.product});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (product.reviewCount == null || product.reviewCount == 0) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.rate_review_outlined,
                size: 48, color: isDark ? Colors.grey[500] : Colors.grey[400]),
            const SizedBox(height: 16),
            Text('Chưa có đánh giá',
                style: TextStyle(
                    color: isDark ? Colors.grey[400] : Colors.grey[600])),
          ],
        ),
      );
    }
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          RatingStars(
              rating: product.averageRating ?? 0,
              size: 24,
              showValue: true,
              reviewCount: product.reviewCount),
        ],
      ),
    );
  }
}

/// Inline batch selector for product detail page
class ProductBatchSelectorInline extends StatelessWidget {
  final List<ProductBatch> batches;
  final ProductBatch? selectedBatch;
  final ValueChanged<ProductBatch> onBatchSelected;

  const ProductBatchSelectorInline({
    super.key,
    required this.batches,
    required this.selectedBatch,
    required this.onBatchSelected,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      color: isDark ? AppColors.cardDark : Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Phân loại',
                  style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: isDark ? Colors.white : Colors.black87)),
              const Spacer(),
              if (selectedBatch != null)
                Text(
                  'Còn ${selectedBatch!.quantity} sản phẩm',
                  style: TextStyle(
                      fontSize: 13,
                      color: selectedBatch!.quantity < 10
                          ? Colors.orange
                          : AppColors.primary),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: batches.map((batch) {
              final isSelected = selectedBatch?.batchId == batch.batchId;
              return GestureDetector(
                onTap: () => onBatchSelected(batch),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary.withOpacity(0.1)
                        : (isDark ? Colors.grey[800] : Colors.grey[100]),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : (isDark ? Colors.grey[700]! : Colors.grey[300]!),
                      width: isSelected ? 2 : 1,
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    batch.productType.typeName,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight:
                          isSelected ? FontWeight.w600 : FontWeight.normal,
                      color: isSelected
                          ? AppColors.primary
                          : (isDark ? Colors.white : Colors.black87),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
