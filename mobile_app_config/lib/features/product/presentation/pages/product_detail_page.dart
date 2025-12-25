import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../shared/widgets/states/error_state_view.dart';
import '../../../../shared/widgets/loading/loading_widget.dart';
import '../../../../shared/widgets/common/cached_image.dart';
import '../../domain/entities/product.dart';
import '../bloc/product_bloc.dart';
import '../bloc/product_event.dart';
import '../bloc/product_state.dart';

/// Product Detail Page
class ProductDetailPage extends StatefulWidget {
  final String productId;

  const ProductDetailPage({
    super.key,
    required this.productId,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  int _selectedImageIndex = 0;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    context.read<ProductBloc>().add(LoadProductDetail(widget.productId));
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
    return CustomScrollView(
      slivers: [
        // App bar with image
        _buildSliverAppBar(product),

        // Product info
        SliverToBoxAdapter(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product name and price
              _buildProductHeader(product),

              const Divider(height: 24),

              // Rating and sold
              _buildRatingSection(product),

              const Divider(height: 24),

              // Description
              _buildDescriptionSection(product),

              // Usage instructions
              if (product.usageInstructions != null)
                _buildUsageSection(product),

              // Manufacturer
              if (product.manufacturerName != null)
                _buildManufacturerSection(product),

              const SizedBox(height: 100), // Space for bottom bar
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSliverAppBar(Product product) {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.8),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.arrow_back, color: Colors.black),
        ),
        onPressed: () => context.pop(),
      ),
      actions: [
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.8),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.favorite_border, color: Colors.black),
          ),
          onPressed: () {
            // TODO: Add to wishlist
          },
        ),
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.8),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.share, color: Colors.black),
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
    if (product.imageUrls.isEmpty) {
      return Container(
        color: AppColors.muted,
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

        // Page indicator
        if (product.imageUrls.length > 1)
          Positioned(
            bottom: 16,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                product.imageUrls.length,
                (index) => Container(
                  width: 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _selectedImageIndex == index
                        ? AppColors.primary
                        : Colors.white.withOpacity(0.5),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildProductHeader(Product product) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Categories
          if (product.categories.isNotEmpty)
            Wrap(
              spacing: 8,
              children: product.categories
                  .take(3)
                  .map((cat) => Chip(
                        label: Text(
                          cat,
                          style: AppTextStyles.labelSmall,
                        ),
                        backgroundColor: AppColors.primaryLighter,
                        padding: EdgeInsets.zero,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ))
                  .toList(),
            ),

          const SizedBox(height: 8),

          // Product name
          Text(
            product.productName,
            style: AppTextStyles.h2,
          ),

          const SizedBox(height: 8),

          // Price
          Text(
            _formatPrice(product.unitPrice),
            style: AppTextStyles.h3.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingSection(Product product) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          // Rating
          if (product.averageRating != null) ...[
            const Icon(Icons.star, color: Colors.amber, size: 20),
            const SizedBox(width: 4),
            Text(
              product.averageRating!.toStringAsFixed(1),
              style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            if (product.reviewCount != null) ...[
              Text(
                ' (${product.reviewCount} đánh giá)',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.mutedForeground,
                ),
              ),
            ],
            const SizedBox(width: 24),
          ],

          // Sold count
          Icon(Icons.shopping_bag_outlined,
              color: AppColors.mutedForeground, size: 18),
          const SizedBox(width: 4),
          Text(
            'Đã bán ${product.totalSaled}',
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDescriptionSection(Product product) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Mô tả sản phẩm',
            style: AppTextStyles.h4,
          ),
          const SizedBox(height: 8),
          Text(
            product.description ?? 'Không có mô tả',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUsageSection(Product product) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Hướng dẫn sử dụng',
            style: AppTextStyles.h4,
          ),
          const SizedBox(height: 8),
          Text(
            product.usageInstructions!,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildManufacturerSection(Product product) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          const Icon(Icons.factory_outlined, color: AppColors.mutedForeground),
          const SizedBox(width: 8),
          Text(
            'Nhà sản xuất: ',
            style: AppTextStyles.bodyMedium,
          ),
          Text(
            product.manufacturerName!,
            style: AppTextStyles.bodyMedium.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  String _formatPrice(double price) {
    return '${price.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]}.',
        )}đ';
  }
}
