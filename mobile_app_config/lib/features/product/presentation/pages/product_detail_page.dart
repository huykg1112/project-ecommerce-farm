import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../core/localization/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/states/error_state_view.dart';
import '../../../../shared/widgets/loading/loading_widget.dart';
import '../../../../shared/widgets/common/cached_image.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
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

/// Enhanced Product Detail Page with tabs, bottom bar, quantity selector
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
  int _selectedImageIndex = 0;
  int _quantity = 1;
  late TabController _tabController;
  ProductBatch? _selectedBatch;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    context.read<ProductBloc>().add(LoadProductDetail(widget.productId));
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  String _formatPrice(double price) {
    final formatter = NumberFormat('#,###', 'vi_VN');
    return '${formatter.format(price)} đ';
  }

  void _incrementQuantity() {
    // Check stock limit if batch is selected
    if (_selectedBatch != null && _quantity >= _selectedBatch!.quantity) {
      CustomSnackBar.showInfo(
        context,
        message: 'Đã đạt số lượng tối đa trong kho',
      );
      return;
    }
    setState(() {
      _quantity++;
    });
  }

  void _decrementQuantity() {
    if (_quantity > 1) {
      setState(() {
        _quantity--;
      });
    }
  }

  void _selectBatch(ProductBatch batch) {
    setState(() {
      _selectedBatch = batch;
      // Reset quantity if exceeds new batch stock
      if (_quantity > batch.quantity) {
        _quantity = batch.quantity > 0 ? batch.quantity : 1;
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
            ? 'Đã xóa khỏi danh sách yêu thích'
            : 'Removed from wishlist',
      );
    } else {
      CustomSnackBar.showSuccess(
        context,
        message: l10n.isVietnamese
            ? 'Đã thêm vào danh sách yêu thích'
            : 'Added to wishlist',
      );
    }
  }

  void _addToCart(Product product) {
    if (_selectedBatch != null) {
      // Add with selected batch
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
      CustomSnackBar.showSuccess(
        context,
        message: 'Đã thêm $_quantity ${product.productName} vào giỏ hàng',
      );
    } else if (product.validBatches.isNotEmpty) {
      // Require batch selection
      CustomSnackBar.showInfo(
        context,
        message: 'Vui lòng chọn loại sản phẩm',
      );
    } else {
      // No batches - add with product price
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
      CustomSnackBar.showSuccess(
        context,
        message: 'Đã thêm $_quantity ${product.productName} vào giỏ hàng',
      );
    }
  }

  void _buyNow(Product product) {
    _addToCart(product);
    context.push('/cart');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: BlocBuilder<ProductBloc, ProductState>(
        builder: (context, state) {
          if (state is ProductLoading) {
            return const LoadingWidget(message: 'Đang tải...');
          }

          if (state is ProductError) {
            return ErrorStateView.genericError(
              message: state.message,
              onRetry: () {
                context
                    .read<ProductBloc>()
                    .add(LoadProductDetail(widget.productId));
              },
            );
          }

          if (state is ProductDetailLoaded) {
            return _buildContent(context, state.product);
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildContent(BuildContext context, Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Stack(
      children: [
        // Main content
        CustomScrollView(
          slivers: [
            // App bar with image carousel
            _buildSliverAppBar(product),

            // Product info
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product header (name, price, discount)
                  _buildProductHeader(product),

                  // Store info
                  if (product.storeName != null) _buildStoreInfo(product),

                  const Divider(height: 1),

                  // Rating and sold count
                  _buildRatingSection(product),

                  const Divider(height: 1),

                  // Quantity selector
                  _buildQuantitySelector(),

                  const Divider(height: 1),

                  // Features (shipping, warranty, etc)
                  _buildFeaturesSection(),

                  const Divider(height: 1),

                  // Tabs (Description, Ingredients, Reviews)
                  _buildTabSection(product),

                  const SizedBox(height: 100), // Space for bottom bar
                ],
              ),
            ),
          ],
        ),

        // Fixed bottom bar
        _buildBottomBar(product),
      ],
    );
  }

  Widget _buildSliverAppBar(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SliverAppBar(
      expandedHeight: 350,
      pinned: true,
      backgroundColor: isDark ? AppColors.backgroundDark : Colors.white,
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: (isDark ? Colors.black : Colors.white).withOpacity(0.8),
            shape: BoxShape.circle,
          ),
          child: Icon(
            Icons.arrow_back,
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        onPressed: () => context.pop(),
      ),
      actions: [
        // Wishlist button
        BlocBuilder<WishlistBloc, WishlistState>(
          builder: (context, wishlistState) {
            final isInWishlist = wishlistState is WishlistLoaded
                ? wishlistState.isInWishlist(product.productId)
                : false;
            return IconButton(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color:
                      (isDark ? Colors.black : Colors.white).withOpacity(0.8),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isInWishlist ? Icons.favorite : Icons.favorite_border,
                  color: isInWishlist
                      ? AppColors.destructive
                      : (isDark ? Colors.white : Colors.black),
                ),
              ),
              onPressed: () => _toggleWishlist(product),
            );
          },
        ),
        // Share button
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: (isDark ? Colors.black : Colors.white).withOpacity(0.8),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.share,
              color: isDark ? Colors.white : Colors.black,
            ),
          ),
          onPressed: () {
            // TODO: Share product
          },
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: _buildImageGallery(product),
      ),
    );
  }

  Widget _buildImageGallery(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (product.imageUrls.isEmpty) {
      return Container(
        color: isDark ? Colors.grey[900] : AppColors.muted,
        child: const Center(
          child: Icon(
            Icons.image_not_supported,
            size: 64,
            color: AppColors.mutedForeground,
          ),
        ),
      );
    }

    return Stack(
      children: [
        // Main image
        PageView.builder(
          itemCount: product.imageUrls.length,
          onPageChanged: (index) {
            setState(() {
              _selectedImageIndex = index;
            });
          },
          itemBuilder: (context, index) {
            return CachedImage.product(
              imageUrl: product.imageUrls[index],
              width: double.infinity,
              height: double.infinity,
            );
          },
        ),

        // Discount badge
        if (product.hasDiscount)
          Positioned(
            top: 100,
            left: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.destructive,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                '-${product.discountPercentage!.toInt()}%',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),

        // Thumbnail row
        if (product.imageUrls.length > 1)
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: SizedBox(
              height: 60,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: product.imageUrls.length,
                itemBuilder: (context, index) {
                  final isSelected = _selectedImageIndex == index;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedImageIndex = index;
                      });
                    },
                    child: Container(
                      width: 60,
                      height: 60,
                      margin: const EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primary
                              : Colors.white.withOpacity(0.5),
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(7),
                        child: CachedImage.product(
                          imageUrl: product.imageUrls[index],
                          width: 60,
                          height: 60,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildProductHeader(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Categories
          if (product.categories.isNotEmpty)
            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: product.categories
                  .take(3)
                  .map((cat) => Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          cat,
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ))
                  .toList(),
            ),

          const SizedBox(height: 12),

          // Product name
          Text(
            product.productName,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black87,
            ),
          ),

          const SizedBox(height: 12),

          // Price row
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // Current price
              Text(
                _formatPrice(product.displayPrice),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 12),
              // Original price (strikethrough)
              if (product.strikethroughPrice != null)
                Text(
                  _formatPrice(product.strikethroughPrice!),
                  style: TextStyle(
                    fontSize: 16,
                    color: isDark ? Colors.grey[500] : Colors.grey[600],
                    decoration: TextDecoration.lineThrough,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStoreInfo(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.primary.withOpacity(0.1),
            child: const Icon(
              Icons.store,
              color: AppColors.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.storeName!,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Xem cửa hàng',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.chevron_right,
            color: AppColors.mutedForeground,
          ),
        ],
      ),
    );
  }

  Widget _buildRatingSection(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          // Rating
          if (product.averageRating != null) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.1),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Row(
                children: [
                  const Icon(Icons.star, color: Colors.amber, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    product.averageRating!.toStringAsFixed(1),
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Text(
              '${product.reviewCount ?? 0} đánh giá',
              style: TextStyle(
                fontSize: 13,
                color: isDark ? Colors.grey[400] : Colors.grey[600],
              ),
            ),
            const SizedBox(width: 16),
          ],

          // Sold count
          Icon(
            Icons.shopping_bag_outlined,
            color: isDark ? Colors.grey[400] : Colors.grey[600],
            size: 18,
          ),
          const SizedBox(width: 4),
          Text(
            'Đã bán ${product.totalSaled}',
            style: TextStyle(
              fontSize: 13,
              color: isDark ? Colors.grey[400] : Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuantitySelector() {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Text(
            'Số lượng',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isDark ? Colors.white : Colors.black87,
            ),
          ),
          const Spacer(),
          Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: isDark ? AppColors.borderDark : Colors.grey[300]!,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                // Decrement button
                InkWell(
                  onTap: _decrementQuantity,
                  child: Container(
                    width: 40,
                    height: 40,
                    alignment: Alignment.center,
                    child: Icon(
                      Icons.remove,
                      size: 20,
                      color: _quantity > 1
                          ? (isDark ? Colors.white : Colors.black87)
                          : Colors.grey,
                    ),
                  ),
                ),
                // Quantity display
                Container(
                  width: 50,
                  height: 40,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    border: Border.symmetric(
                      vertical: BorderSide(
                        color:
                            isDark ? AppColors.borderDark : Colors.grey[300]!,
                      ),
                    ),
                  ),
                  child: Text(
                    _quantity.toString(),
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                ),
                // Increment button
                InkWell(
                  onTap: _incrementQuantity,
                  child: Container(
                    width: 40,
                    height: 40,
                    alignment: Alignment.center,
                    child: Icon(
                      Icons.add,
                      size: 20,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturesSection() {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildFeatureItem(
            Icons.local_shipping_outlined,
            'Miễn phí ship',
            isDark,
          ),
          _buildFeatureItem(
            Icons.verified_user_outlined,
            'Chính hãng',
            isDark,
          ),
          _buildFeatureItem(
            Icons.replay_outlined,
            '7 ngày đổi trả',
            isDark,
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureItem(IconData icon, String label, bool isDark) {
    return Column(
      children: [
        Icon(
          icon,
          size: 24,
          color: AppColors.primary,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: isDark ? Colors.grey[400] : Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildTabSection(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        // Tab bar
        Container(
          color: isDark ? AppColors.cardDark : Colors.grey[50],
          child: TabBar(
            controller: _tabController,
            labelColor: AppColors.primary,
            unselectedLabelColor: isDark ? Colors.grey[400] : Colors.grey[600],
            indicatorColor: AppColors.primary,
            indicatorWeight: 3,
            tabs: const [
              Tab(text: 'Mô tả'),
              Tab(text: 'Thành phần'),
              Tab(text: 'Đánh giá'),
            ],
          ),
        ),

        // Tab content
        SizedBox(
          height: 300,
          child: TabBarView(
            controller: _tabController,
            children: [
              // Description tab
              _buildDescriptionTab(product),

              // Ingredients tab
              _buildIngredientsTab(product),

              // Reviews tab
              _buildReviewsTab(product),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDescriptionTab(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            product.description ?? 'Không có mô tả',
            style: TextStyle(
              fontSize: 14,
              height: 1.6,
              color: isDark ? Colors.grey[300] : Colors.grey[700],
            ),
          ),
          if (product.usageInstructions != null) ...[
            const SizedBox(height: 16),
            Text(
              'Hướng dẫn sử dụng',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              product.usageInstructions!,
              style: TextStyle(
                fontSize: 14,
                height: 1.6,
                color: isDark ? Colors.grey[300] : Colors.grey[700],
              ),
            ),
          ],
          if (product.manufacturerName != null) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(
                  Icons.factory_outlined,
                  size: 18,
                  color: AppColors.mutedForeground,
                ),
                const SizedBox(width: 8),
                Text(
                  'Nhà sản xuất: ${product.manufacturerName}',
                  style: TextStyle(
                    fontSize: 14,
                    color: isDark ? Colors.grey[300] : Colors.grey[700],
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildIngredientsTab(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // TODO: Add ingredients data to Product entity
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.science_outlined,
            size: 48,
            color: isDark ? Colors.grey[600] : Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'Chưa có thông tin thành phần',
            style: TextStyle(
              color: isDark ? Colors.grey[400] : Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewsTab(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // TODO: Load real reviews
    if (product.reviewCount == null || product.reviewCount == 0) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.rate_review_outlined,
              size: 48,
              color: isDark ? Colors.grey[600] : Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'Chưa có đánh giá',
              style: TextStyle(
                color: isDark ? Colors.grey[400] : Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Hãy là người đầu tiên đánh giá sản phẩm này',
              style: TextStyle(
                fontSize: 12,
                color: isDark ? Colors.grey[500] : Colors.grey[500],
              ),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Rating summary
          Row(
            children: [
              Text(
                product.averageRating?.toStringAsFixed(1) ?? '0.0',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: List.generate(
                      5,
                      (i) => Icon(
                        i < (product.averageRating?.round() ?? 0)
                            ? Icons.star
                            : Icons.star_border,
                        color: Colors.amber,
                        size: 18,
                      ),
                    ),
                  ),
                  Text(
                    '${product.reviewCount} đánh giá',
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 12,
          bottom: MediaQuery.of(context).padding.bottom + 12,
        ),
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
        child: Row(
          children: [
            // Chat with seller button
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                border: Border.all(
                  color: isDark ? AppColors.borderDark : Colors.grey[300]!,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: IconButton(
                icon: Icon(
                  Icons.chat_bubble_outline,
                  color: AppColors.primary,
                ),
                onPressed: () {
                  // TODO: Open chat
                },
              ),
            ),
            const SizedBox(width: 12),

            // Add to cart button
            Expanded(
              child: SizedBox(
                height: 48,
                child: OutlinedButton(
                  onPressed: () => _addToCart(product),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    side: const BorderSide(color: AppColors.primary, width: 2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_shopping_cart, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Thêm vào giỏ',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Buy now button
            Expanded(
              child: SizedBox(
                height: 48,
                child: ElevatedButton(
                  onPressed: () => _buyNow(product),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Mua ngay',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
