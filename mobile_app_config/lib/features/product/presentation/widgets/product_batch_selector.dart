import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/product.dart';
import '../../domain/entities/product_batch.dart';

/// Bottom sheet for selecting product batch/type before adding to cart
class ProductBatchSelector extends StatefulWidget {
  final Product product;
  final Function(ProductBatch batch, int quantity) onAddToCart;

  const ProductBatchSelector({
    super.key,
    required this.product,
    required this.onAddToCart,
  });

  /// Show the batch selector bottom sheet
  static Future<void> show({
    required BuildContext context,
    required Product product,
    required Function(ProductBatch batch, int quantity) onAddToCart,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ProductBatchSelector(
        product: product,
        onAddToCart: onAddToCart,
      ),
    );
  }

  @override
  State<ProductBatchSelector> createState() => _ProductBatchSelectorState();
}

class _ProductBatchSelectorState extends State<ProductBatchSelector> {
  ProductBatch? _selectedBatch;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    // Auto-select first valid batch
    if (widget.product.validBatches.isNotEmpty) {
      _selectedBatch = widget.product.validBatches.first;
    }
  }

  void _incrementQuantity() {
    if (_selectedBatch != null && _quantity < _selectedBatch!.quantity) {
      setState(() {
        _quantity++;
      });
    }
  }

  void _decrementQuantity() {
    if (_quantity > 1) {
      setState(() {
        _quantity--;
      });
    }
  }

  String _formatPrice(double price) {
    return '${price.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        )} đ';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final validBatches = widget.product.validBatches;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle bar
            Center(
              child: Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.grey[700] : Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Product header
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  // Product image
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: widget.product.imageUrls.isNotEmpty
                        ? Image.network(
                            widget.product.imageUrls.first,
                            width: 80,
                            height: 80,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => _buildPlaceholder(),
                          )
                        : _buildPlaceholder(),
                  ),
                  const SizedBox(width: 12),
                  // Product info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.product.productName,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isDark ? Colors.white : Colors.black,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        if (_selectedBatch != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            _formatPrice(_selectedBatch!.finalPrice),
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                          if (_selectedBatch!.discountPercentage != null)
                            Text(
                              _formatPrice(_selectedBatch!.unitPrice),
                              style: TextStyle(
                                fontSize: 14,
                                color: isDark ? Colors.grey[500] : Colors.grey,
                                decoration: TextDecoration.lineThrough,
                              ),
                            ),
                        ],
                      ],
                    ),
                  ),
                  // Close button
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            const Divider(height: 1),

            // Batch/Type selection
            if (validBatches.isEmpty)
              Padding(
                padding: const EdgeInsets.all(24),
                child: Center(
                  child: Column(
                    children: [
                      Icon(
                        Icons.inventory_2_outlined,
                        size: 48,
                        color: isDark ? Colors.grey[600] : Colors.grey[400],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Sản phẩm tạm hết hàng',
                        style: TextStyle(
                          fontSize: 16,
                          color: isDark ? Colors.grey[400] : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else ...[
              // Type/Batch selection
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: Text(
                  'Chọn loại',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: validBatches.map((batch) {
                    final isSelected = _selectedBatch?.batchId == batch.batchId;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedBatch = batch;
                          // Reset quantity if exceeds new batch stock
                          if (_quantity > batch.quantity) {
                            _quantity = batch.quantity;
                          }
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.primary.withOpacity(0.1)
                              : (isDark ? Colors.grey[800] : Colors.grey[100]),
                          border: Border.all(
                            color: isSelected
                                ? AppColors.primary
                                : (isDark
                                    ? Colors.grey[700]!
                                    : Colors.grey[300]!),
                            width: isSelected ? 2 : 1,
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              batch.productType.typeName,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                color: isSelected
                                    ? AppColors.primary
                                    : (isDark ? Colors.white : Colors.black),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Còn ${batch.quantity}',
                              style: TextStyle(
                                fontSize: 12,
                                color: batch.quantity < 5
                                    ? Colors.orange
                                    : (isDark
                                        ? Colors.grey[400]
                                        : Colors.grey[600]),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              // Quantity selector
              if (_selectedBatch != null) ...[
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Số lượng',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: isDark ? Colors.white : Colors.black,
                        ),
                      ),
                      Text(
                        'Tồn kho: ${_selectedBatch!.quantity}',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.grey[400] : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                            color:
                                isDark ? Colors.grey[700]! : Colors.grey[300]!,
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove),
                              onPressed:
                                  _quantity > 1 ? _decrementQuantity : null,
                              color: isDark ? Colors.white : Colors.black,
                            ),
                            Container(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 16),
                              child: Text(
                                '$_quantity',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : Colors.black,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.add),
                              onPressed: _quantity < _selectedBatch!.quantity
                                  ? _incrementQuantity
                                  : null,
                              color: isDark ? Colors.white : Colors.black,
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      if (_quantity >= _selectedBatch!.quantity)
                        Text(
                          'Đạt tối đa',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.orange,
                          ),
                        ),
                    ],
                  ),
                ),
              ],

              // Add to cart button
              Padding(
                padding: const EdgeInsets.all(16),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _selectedBatch != null
                        ? () {
                            widget.onAddToCart(_selectedBatch!, _quantity);
                            Navigator.pop(context);
                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      _selectedBatch != null
                          ? 'Thêm vào giỏ hàng - ${_formatPrice(_selectedBatch!.finalPrice * _quantity)}'
                          : 'Chọn loại sản phẩm',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      width: 80,
      height: 80,
      color: Colors.grey[300],
      child: const Icon(Icons.image, color: Colors.grey),
    );
  }
}
