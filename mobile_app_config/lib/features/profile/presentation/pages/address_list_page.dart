import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../shared/widgets/common/app_button.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../../../../shared/widgets/states/empty_state_view.dart';
import '../../../../shared/widgets/loading/loading_widget.dart';

/// Address entity for display
class AddressItem {
  final String id;
  final String addressDetail;
  final double latitude;
  final double longitude;
  final bool isDefault;

  const AddressItem({
    required this.id,
    required this.addressDetail,
    required this.latitude,
    required this.longitude,
    this.isDefault = false,
  });
}

/// Address List Page
class AddressListPage extends StatefulWidget {
  const AddressListPage({super.key});

  @override
  State<AddressListPage> createState() => _AddressListPageState();
}

class _AddressListPageState extends State<AddressListPage> {
  bool _isLoading = true;
  List<AddressItem> _addresses = [];

  @override
  void initState() {
    super.initState();
    _loadAddresses();
  }

  Future<void> _loadAddresses() async {
    setState(() => _isLoading = true);

    try {
      // TODO: Call API to get addresses
      await Future.delayed(const Duration(seconds: 1));

      // Mock data for now
      _addresses = [
        const AddressItem(
          id: '1',
          addressDetail: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
          latitude: 10.7285,
          longitude: 106.7151,
          isDefault: true,
        ),
        const AddressItem(
          id: '2',
          addressDetail: '456 Lê Văn Việt, Quận 9, TP. Hồ Chí Minh',
          latitude: 10.8431,
          longitude: 106.7651,
        ),
      ];
    } catch (e) {
      if (mounted) {
        CustomSnackBar.showError(context, message: 'Không thể tải địa chỉ');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Địa chỉ giao hàng'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const LoadingWidget()
          : _addresses.isEmpty
              ? _buildEmptyState()
              : _buildAddressList(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddAddressDialog(context),
        icon: const Icon(Icons.add),
        label: const Text('Thêm địa chỉ'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildEmptyState() {
    return const EmptyStateView(
      title: 'Chưa có địa chỉ nào',
      message: 'Thêm địa chỉ giao hàng để đặt hàng dễ dàng hơn',
      icon: Icons.location_off_outlined,
    );
  }

  Widget _buildAddressList() {
    return RefreshIndicator(
      onRefresh: _loadAddresses,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _addresses.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final address = _addresses[index];
          return _buildAddressCard(address);
        },
      ),
    );
  }

  Widget _buildAddressCard(AddressItem address) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: address.isDefault ? AppColors.primary : AppColors.border,
          width: address.isDefault ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with default badge
          Row(
            children: [
              Icon(
                Icons.location_on,
                color: address.isDefault
                    ? AppColors.primary
                    : AppColors.mutedForeground,
                size: 20,
              ),
              const SizedBox(width: 8),
              if (address.isDefault)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    'Mặc định',
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              const Spacer(),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, size: 20),
                onSelected: (value) {
                  switch (value) {
                    case 'set_default':
                      _setDefaultAddress(address);
                      break;
                    case 'edit':
                      _editAddress(address);
                      break;
                    case 'delete':
                      _deleteAddress(address);
                      break;
                  }
                },
                itemBuilder: (context) => [
                  if (!address.isDefault)
                    const PopupMenuItem(
                      value: 'set_default',
                      child: Row(
                        children: [
                          Icon(Icons.check_circle_outline, size: 18),
                          SizedBox(width: 8),
                          Text('Đặt làm mặc định'),
                        ],
                      ),
                    ),
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit_outlined, size: 18),
                        SizedBox(width: 8),
                        Text('Chỉnh sửa'),
                      ],
                    ),
                  ),
                  if (!address.isDefault)
                    const PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete_outline,
                              size: 18, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Xóa', style: TextStyle(color: Colors.red)),
                        ],
                      ),
                    ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Address detail
          Text(
            address.addressDetail,
            style: AppTextStyles.bodyMedium,
          ),

          const SizedBox(height: 8),

          // Coordinates (for map preview)
          Text(
            'Lat: ${address.latitude.toStringAsFixed(4)}, Lng: ${address.longitude.toStringAsFixed(4)}',
            style: AppTextStyles.labelSmall.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
        ],
      ),
    );
  }

  void _showAddAddressDialog(BuildContext context) {
    final controller = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle bar
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              Text(
                'Thêm địa chỉ mới',
                style: AppTextStyles.h3,
              ),

              const SizedBox(height: 16),

              TextField(
                controller: controller,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Nhập địa chỉ chi tiết',
                  prefixIcon: Icon(Icons.location_on_outlined),
                  alignLabelWithHint: true,
                ),
              ),

              const SizedBox(height: 12),

              // Map placeholder
              Container(
                height: 150,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.muted,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.map_outlined,
                      size: 48,
                      color: AppColors.mutedForeground,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Chọn vị trí trên bản đồ',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.mutedForeground,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              AppButton.primary(
                text: 'Lưu địa chỉ',
                isFullWidth: true,
                onPressed: () {
                  Navigator.pop(ctx);
                  CustomSnackBar.showSuccess(
                    context,
                    message: 'Đã thêm địa chỉ mới',
                  );
                  _loadAddresses();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _setDefaultAddress(AddressItem address) async {
    try {
      // TODO: Call API
      await Future.delayed(const Duration(milliseconds: 500));

      setState(() {
        _addresses = _addresses.map((a) {
          return AddressItem(
            id: a.id,
            addressDetail: a.addressDetail,
            latitude: a.latitude,
            longitude: a.longitude,
            isDefault: a.id == address.id,
          );
        }).toList();
      });

      if (mounted) {
        CustomSnackBar.showSuccess(context,
            message: 'Đã đặt làm địa chỉ mặc định');
      }
    } catch (e) {
      if (mounted) {
        CustomSnackBar.showError(context,
            message: 'Không thể cập nhật địa chỉ');
      }
    }
  }

  void _editAddress(AddressItem address) {
    // TODO: Navigate to edit address page or show dialog
    CustomSnackBar.showInfo(context, message: 'Tính năng đang phát triển');
  }

  void _deleteAddress(AddressItem address) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa địa chỉ'),
        content: const Text('Bạn có chắc muốn xóa địa chỉ này?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);

              // TODO: Call delete API
              await Future.delayed(const Duration(milliseconds: 500));

              setState(() {
                _addresses.removeWhere((a) => a.id == address.id);
              });

              if (mounted) {
                CustomSnackBar.showSuccess(context, message: 'Đã xóa địa chỉ');
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Xóa'),
          ),
        ],
      ),
    );
  }
}
