import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

/// Cached network image with placeholder and error handling
class CachedImage extends StatelessWidget {
  final String? imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final String? placeholder;
  final Widget? placeholderWidget;
  final Widget? errorWidget;
  final Color? backgroundColor;

  const CachedImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.placeholder,
    this.placeholderWidget,
    this.errorWidget,
    this.backgroundColor,
  });

  /// Square cached image
  factory CachedImage.square({
    required String? imageUrl,
    required double size,
    BoxFit fit = BoxFit.cover,
    double borderRadius = 8,
  }) {
    return CachedImage(
      imageUrl: imageUrl,
      width: size,
      height: size,
      fit: fit,
      borderRadius: BorderRadius.circular(borderRadius),
    );
  }

  /// Circular cached image (avatar)
  factory CachedImage.circle({
    required String? imageUrl,
    required double size,
    BoxFit fit = BoxFit.cover,
  }) {
    return CachedImage(
      imageUrl: imageUrl,
      width: size,
      height: size,
      fit: fit,
      borderRadius: BorderRadius.circular(size / 2),
    );
  }

  /// Product image with standard styling
  factory CachedImage.product({
    required String? imageUrl,
    double? width,
    double? height,
    double borderRadius = 8,
  }) {
    return CachedImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      fit: BoxFit.cover,
      borderRadius: BorderRadius.circular(borderRadius),
      backgroundColor: AppColors.muted,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (imageUrl == null || imageUrl!.isEmpty) {
      return _buildPlaceholder();
    }

    Widget image = CachedNetworkImage(
      imageUrl: imageUrl!,
      width: width,
      height: height,
      fit: fit,
      placeholder: (context, url) => _buildLoadingPlaceholder(),
      errorWidget: (context, url, error) => _buildErrorWidget(),
      fadeInDuration: const Duration(milliseconds: 200),
      fadeOutDuration: const Duration(milliseconds: 200),
    );

    if (borderRadius != null) {
      image = ClipRRect(
        borderRadius: borderRadius!,
        child: image,
      );
    }

    if (backgroundColor != null) {
      image = Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: borderRadius,
        ),
        child: image,
      );
    }

    return image;
  }

  Widget _buildPlaceholder() {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.muted,
        borderRadius: borderRadius,
      ),
      child: placeholderWidget ??
          Center(
            child: Icon(
              Icons.image_outlined,
              color: AppColors.mutedForeground,
              size: _getIconSize(),
            ),
          ),
    );
  }

  Widget _buildLoadingPlaceholder() {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.muted,
        borderRadius: borderRadius,
      ),
      child: Center(
        child: SizedBox(
          width: _getIconSize() * 0.6,
          height: _getIconSize() * 0.6,
          child: const CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
          ),
        ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.muted,
        borderRadius: borderRadius,
      ),
      child: errorWidget ??
          Center(
            child: Icon(
              Icons.broken_image_outlined,
              color: AppColors.mutedForeground,
              size: _getIconSize(),
            ),
          ),
    );
  }

  double _getIconSize() {
    if (width != null && height != null) {
      final minSize = width! < height! ? width! : height!;
      return (minSize * 0.4).clamp(16, 48);
    }
    return 32;
  }
}

/// Avatar image with initials fallback
class AvatarImage extends StatelessWidget {
  final String? imageUrl;
  final String? name;
  final double size;
  final Color? backgroundColor;

  const AvatarImage({
    super.key,
    this.imageUrl,
    this.name,
    this.size = 40,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return CachedImage.circle(
        imageUrl: imageUrl,
        size: size,
      );
    }

    // Show initials
    final initials = _getInitials();
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.primary,
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          initials,
          style: TextStyle(
            color: Colors.white,
            fontSize: size * 0.4,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  String _getInitials() {
    if (name == null || name!.isEmpty) return '?';

    final parts = name!.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
}
