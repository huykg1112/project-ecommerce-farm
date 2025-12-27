import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/common/app_button.dart';
import '../../../../shared/widgets/common/cached_image.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../../../../shared/widgets/common/price_display.dart';
import '../../../auth/domain/entities/user.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../../../cart/presentation/bloc/local_cart_bloc.dart';
import '../../domain/entities/payment_method.dart';
import '../../domain/entities/shipping_address.dart';

/// Checkout Page for placing orders
class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final _formKey = GlobalKey<FormState>();
  bool _isSubmitting = false;

  // Shipping info
  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();

  // Payment method
  PaymentMethod? _selectedPaymentMethod;
  final List<PaymentMethod> _paymentMethods = const [
    PaymentMethod(
      paymentMethodId: 'cod',
      methodName: 'COD',
      description: 'Thanh toán khi nhận hàng',
    ),
    PaymentMethod(
      paymentMethodId: 'vnpay',
      methodName: 'VNPay',
      description: 'Thanh toán qua VNPay',
    ),
  ];

  // Shipping fee calculation
  static const double _freeShippingThreshold = 300000;
  static const double _standardShippingFee = 30000;

  @override
  void initState() {
    super.initState();
    _selectedPaymentMethod = _paymentMethods.first;
    _loadUserInfo();
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _loadUserInfo() async {
    // Get user info from AuthBloc
    final authState = context.read<AuthBloc>().state;
    if (authState is Authenticated) {
      final user = authState.user;
      _fillUserInfo(user);
    }
  }

  void _fillUserInfo(User user) {
    setState(() {
      if (user.fullName != null && user.fullName!.isNotEmpty) {
        _fullNameController.text = user.fullName!;
      }
      if (user.phoneNumber != null && user.phoneNumber!.isNotEmpty) {
        _phoneController.text = user.phoneNumber!;
      }
      _emailController.text = user.email;
    });
  }

  double _calculateShippingFee(double subtotal) {
    return subtotal >= _freeShippingThreshold ? 0 : _standardShippingFee;
  }

  ShippingAddress _getShippingAddress() {
    return ShippingAddress(
      fullName: _fullNameController.text.trim(),
      phoneNumber: _phoneController.text.trim(),
      email: _emailController.text.trim(),
      addressDetail: _addressController.text.trim(),
    );
  }

  Future<void> _placeOrder(List<LocalCartItem> selectedItems, double totalAmount) async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final address = _getShippingAddress();
    if (!address.isValid) {
      CustomSnackBar.showError(context, message: 'Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    if (selectedItems.isEmpty) {
      CustomSnackBar.showError(context, message: 'Không có sản phẩm nào để đặt hàng');
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      // TODO: Call API to create order
      await Future.delayed(const Duration(seconds: 2));

      // Clear selected items from cart
      for (final item in selectedItems) {
        if (mounted) {
          context.read<LocalCartBloc>().add(RemoveFromLocalCart(item.id));
        }
      }

      if (mounted) {
        // Navigate to success page
        context.go('/checkout/success', extra: {
          'orderId': 'ORD-${DateTime.now().millisecondsSinceEpoch}',
          'totalAmount': totalAmount,
          'paymentMethod': _selectedPaymentMethod?.methodName,
        });
      }
    } catch (e) {
      if (mounted) {
        CustomSnackBar.showError(context, message: 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocBuilder<LocalCartBloc, LocalCartState>(
      builder: (context, state) {
        if (state is! LocalCartLoaded) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final selectedItems = state.items.where((item) => state.selectedItemIds.contains(item.id)).toList();
        final subtotal = state.selectedTotalAmount;
        final shippingFee = _calculateShippingFee(subtotal);
        final totalAmount = subtotal + shippingFee;

        if (selectedItems.isEmpty) {
          return Scaffold(
            appBar: AppBar(title: const Text('Thanh toán')),
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(
                    'Không có sản phẩm nào được chọn',
                    style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 24),
                  AppButton.primary(
                    text: 'Quay lại giỏ hàng',
                    onPressed: () => context.pop(),
                  ),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(
            title: const Text('Thanh toán'),
            centerTitle: true,
          ),
          body: Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 120),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Shipping Info Section
                  _buildSectionCard(
                    context,
                    title: 'Thông tin người nhận',
                    icon: Icons.person_outline,
                    child: Column(
                      children: [
                        _buildTextField(
                          controller: _fullNameController,
                          label: 'Họ và tên',
                          hint: 'Nguyễn Văn A',
                          icon: Icons.person,
                          validator: (value) => value == null || value.isEmpty
                              ? 'Vui lòng nhập họ tên'
                              : null,
                        ),
                        const SizedBox(height: 16),
                        _buildTextField(
                          controller: _phoneController,
                          label: 'Số điện thoại',
                          hint: '0912345678',
                          icon: Icons.phone,
                          keyboardType: TextInputType.phone,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Vui lòng nhập số điện thoại';
                            }
                            if (!RegExp(r'^0[0-9]{9}$').hasMatch(value)) {
                              return 'Số điện thoại không hợp lệ';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        _buildTextField(
                          controller: _emailController,
                          label: 'Email (không bắt buộc)',
                          hint: 'example@email.com',
                          icon: Icons.email,
                          keyboardType: TextInputType.emailAddress,
                        ),
                      ],
                    ),
                  ),

                  // Address Section
                  _buildSectionCard(
                    context,
                    title: 'Địa chỉ giao hàng',
                    icon: Icons.location_on_outlined,
                    child: Column(
                      children: [
                        _buildTextField(
                          controller: _addressController,
                          label: 'Địa chỉ chi tiết',
                          hint: 'Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP',
                          icon: Icons.home,
                          maxLines: 2,
                          validator: (value) => value == null || value.isEmpty
                              ? 'Vui lòng nhập địa chỉ'
                              : null,
                        ),
                        const SizedBox(height: 12),
                        // Address list button
                        InkWell(
                          onTap: () => context.push('/addresses'),
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              border: Border.all(color: AppColors.border),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.bookmark_border, color: AppColors.primary),
                                const SizedBox(width: 12),
                                const Expanded(
                                  child: Text('Chọn từ sổ địa chỉ'),
                                ),
                                const Icon(Icons.chevron_right, color: AppColors.mutedForeground),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Shipping Method Section
                  _buildSectionCard(
                    context,
                    title: 'Phương thức vận chuyển',
                    icon: Icons.local_shipping_outlined,
                    child: Column(
                      children: [
                        _buildShippingOption(
                          title: 'Giao hàng tiêu chuẩn',
                          subtitle: '2-3 ngày',
                          fee: shippingFee,
                          isSelected: true,
                        ),
                        if (subtotal < _freeShippingThreshold)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              'Miễn phí vận chuyển cho đơn hàng từ ${_formatCurrency(_freeShippingThreshold)}',
                              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                            ),
                          ),
                      ],
                    ),
                  ),

                  // Payment Method Section
                  _buildSectionCard(
                    context,
                    title: 'Phương thức thanh toán',
                    icon: Icons.payment_outlined,
                    child: Column(
                      children: _paymentMethods.map((method) {
                        final isSelected = _selectedPaymentMethod?.paymentMethodId == method.paymentMethodId;
                        return _buildPaymentOption(
                          method: method,
                          isSelected: isSelected,
                          onTap: () => setState(() => _selectedPaymentMethod = method),
                        );
                      }).toList(),
                    ),
                  ),

                  // Order Summary Section
                  _buildSectionCard(
                    context,
                    title: 'Đơn hàng của bạn',
                    icon: Icons.shopping_bag_outlined,
                    child: Column(
                      children: [
                        ...selectedItems.map((item) => _buildOrderItem(item, isDark)),
                        const Divider(height: 24),
                        _buildSummaryRow('Tạm tính', subtotal),
                        const SizedBox(height: 8),
                        _buildSummaryRow(
                          'Phí vận chuyển',
                          shippingFee,
                          isFree: shippingFee == 0,
                        ),
                        const Divider(height: 24),
                        _buildSummaryRow('Tổng cộng', totalAmount, isTotal: true),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
          bottomNavigationBar: _buildBottomBar(context, selectedItems, totalAmount),
        );
      },
    );
  }

  Widget _buildSectionCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Widget child,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon, size: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }

  Widget _buildShippingOption({
    required String title,
    required String subtitle,
    required double fee,
    required bool isSelected,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(
          color: isSelected ? AppColors.primary : AppColors.border,
          width: isSelected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(8),
        color: isSelected ? AppColors.primary.withOpacity(0.05) : null,
      ),
      child: Row(
        children: [
          Icon(
            isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
            color: isSelected ? AppColors.primary : AppColors.mutedForeground,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
                Text(subtitle, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
              ],
            ),
          ),
          Text(
            fee > 0 ? _formatCurrency(fee) : 'Miễn phí',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: fee == 0 ? AppColors.success : null,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentOption({
    required PaymentMethod method,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    IconData icon;
    if (method.isCOD) {
      icon = Icons.money;
    } else if (method.isVNPay) {
      icon = Icons.credit_card;
    } else {
      icon = Icons.payment;
    }

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(8),
          color: isSelected ? AppColors.primary.withOpacity(0.05) : null,
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected ? AppColors.primary : AppColors.mutedForeground,
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(method.methodName, style: const TextStyle(fontWeight: FontWeight.w500)),
                  if (method.description != null)
                    Text(
                      method.description!,
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItem(LocalCartItem item, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: CachedImage.product(
              imageUrl: item.imageUrl,
              width: 60,
              height: 60,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (item.batchName != null)
                  Text(
                    item.batchName!,
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    PriceDisplayCompact(
                      price: item.finalPrice,
                      originalPrice: item.hasDiscount ? item.price : null,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'x${item.quantity}',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Text(
            _formatCurrency(item.totalPrice),
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, double amount, {bool isTotal = false, bool isFree = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isTotal ? 16 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? null : Colors.grey[600],
          ),
        ),
        Text(
          isFree ? 'Miễn phí' : _formatCurrency(amount),
          style: TextStyle(
            fontSize: isTotal ? 18 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? AppColors.primary : (isFree ? AppColors.success : null),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomBar(BuildContext context, List<LocalCartItem> selectedItems, double totalAmount) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).padding.bottom + 12),
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
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Tổng thanh toán',
                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                ),
                Text(
                  _formatCurrency(totalAmount),
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              onPressed: _isSubmitting
                  ? null
                  : () => _placeOrder(selectedItems, totalAmount),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text(
                      'Đặt hàng',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatCurrency(double amount) {
    return '${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}đ';
  }
}
