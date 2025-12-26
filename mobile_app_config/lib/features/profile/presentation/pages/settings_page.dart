import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_event.dart';

/// Settings Page
class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = false;
  String _selectedLanguage = 'vi';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cài đặt'),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Notifications Section
          _buildSectionTitle('Thông báo'),
          _buildSettingCard(
            children: [
              _buildSwitchTile(
                icon: Icons.notifications_outlined,
                title: 'Thông báo đẩy',
                subtitle: 'Nhận thông báo về đơn hàng và khuyến mãi',
                value: _notificationsEnabled,
                onChanged: (value) {
                  setState(() => _notificationsEnabled = value);
                  CustomSnackBar.showInfo(
                    context,
                    message: value ? 'Đã bật thông báo' : 'Đã tắt thông báo',
                  );
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Appearance Section
          _buildSectionTitle('Giao diện'),
          _buildSettingCard(
            children: [
              _buildSwitchTile(
                icon: Icons.dark_mode_outlined,
                title: 'Chế độ tối',
                subtitle: 'Giảm mỏi mắt khi sử dụng ban đêm',
                value: _darkModeEnabled,
                onChanged: (value) {
                  setState(() => _darkModeEnabled = value);
                  CustomSnackBar.showInfo(
                    context,
                    message: 'Tính năng đang được phát triển',
                  );
                },
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.language_outlined,
                title: 'Ngôn ngữ',
                subtitle: _selectedLanguage == 'vi' ? 'Tiếng Việt' : 'English',
                onTap: _showLanguageDialog,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Privacy Section
          _buildSectionTitle('Bảo mật & Quyền riêng tư'),
          _buildSettingCard(
            children: [
              _buildOptionTile(
                icon: Icons.lock_outline,
                title: 'Đổi mật khẩu',
                subtitle: 'Cập nhật mật khẩu tài khoản',
                onTap: () => context.push('/change-password'),
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.privacy_tip_outlined,
                title: 'Chính sách bảo mật',
                subtitle: 'Xem chính sách bảo mật của chúng tôi',
                onTap: () {
                  CustomSnackBar.showInfo(context, message: 'Đang phát triển');
                },
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.description_outlined,
                title: 'Điều khoản sử dụng',
                subtitle: 'Xem điều khoản và điều kiện',
                onTap: () {
                  CustomSnackBar.showInfo(context, message: 'Đang phát triển');
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Support Section
          _buildSectionTitle('Hỗ trợ'),
          _buildSettingCard(
            children: [
              _buildOptionTile(
                icon: Icons.help_outline,
                title: 'Trung tâm trợ giúp',
                subtitle: 'Câu hỏi thường gặp và hướng dẫn',
                onTap: () {
                  CustomSnackBar.showInfo(context, message: 'Đang phát triển');
                },
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.support_agent_outlined,
                title: 'Liên hệ hỗ trợ',
                subtitle: 'Gửi yêu cầu hỗ trợ',
                onTap: () {
                  CustomSnackBar.showInfo(context, message: 'Đang phát triển');
                },
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.info_outline,
                title: 'Về ứng dụng',
                subtitle: 'Phiên bản 1.0.0',
                onTap: _showAboutDialog,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Danger Zone
          _buildSectionTitle('Vùng nguy hiểm'),
          _buildSettingCard(
            borderColor: AppColors.destructive.withOpacity(0.3),
            children: [
              _buildOptionTile(
                icon: Icons.logout,
                title: 'Đăng xuất',
                subtitle: 'Đăng xuất khỏi tài khoản',
                iconColor: AppColors.destructive,
                textColor: AppColors.destructive,
                onTap: () => _showLogoutDialog(context),
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.delete_forever_outlined,
                title: 'Xóa tài khoản',
                subtitle: 'Xóa vĩnh viễn tài khoản và dữ liệu',
                iconColor: AppColors.destructive,
                textColor: AppColors.destructive,
                onTap: () => _showDeleteAccountDialog(context),
              ),
            ],
          ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Text(
        title,
        style: AppTextStyles.labelMedium.copyWith(
          color: AppColors.mutedForeground,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildSettingCard({
    required List<Widget> children,
    Color? borderColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: borderColor ?? AppColors.border,
        ),
      ),
      child: Column(children: children),
    );
  }

  Widget _buildSwitchTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
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
                Text(title,
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                    )),
                Text(subtitle,
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.mutedForeground,
                    )),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppColors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildOptionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color? iconColor,
    Color? textColor,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: (iconColor ?? AppColors.primary).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child:
                  Icon(icon, color: iconColor ?? AppColors.primary, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: AppTextStyles.bodyMedium.copyWith(
                        fontWeight: FontWeight.w600,
                        color: textColor,
                      )),
                  Text(subtitle,
                      style: AppTextStyles.labelSmall.copyWith(
                        color: textColor?.withOpacity(0.7) ??
                            AppColors.mutedForeground,
                      )),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: AppColors.mutedForeground),
          ],
        ),
      ),
    );
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (ctx) => SimpleDialog(
        title: const Text('Chọn ngôn ngữ'),
        children: [
          RadioListTile<String>(
            title: const Text('Tiếng Việt'),
            value: 'vi',
            groupValue: _selectedLanguage,
            onChanged: (value) {
              setState(() => _selectedLanguage = value!);
              Navigator.pop(ctx);
              CustomSnackBar.showInfo(context, message: 'Đã chọn Tiếng Việt');
            },
          ),
          RadioListTile<String>(
            title: const Text('English'),
            value: 'en',
            groupValue: _selectedLanguage,
            onChanged: (value) {
              setState(() => _selectedLanguage = value!);
              Navigator.pop(ctx);
              CustomSnackBar.showInfo(context, message: 'Selected English');
            },
          ),
        ],
      ),
    );
  }

  void _showAboutDialog() {
    showAboutDialog(
      context: context,
      applicationName: 'Farm E-Commerce',
      applicationVersion: '1.0.0',
      applicationIcon: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.eco, color: Colors.white, size: 36),
      ),
      children: [
        const Text('Ứng dụng mua bán thuốc bảo vệ thực vật với tư vấn AI'),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc muốn đăng xuất?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<AuthBloc>().add(const LogoutRequested());
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.destructive),
            child: const Text('Đăng xuất'),
          ),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa tài khoản'),
        content: const Text(
          'Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              CustomSnackBar.showInfo(context,
                  message: 'Tính năng đang phát triển');
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.destructive),
            child: const Text('Xóa tài khoản'),
          ),
        ],
      ),
    );
  }
}
