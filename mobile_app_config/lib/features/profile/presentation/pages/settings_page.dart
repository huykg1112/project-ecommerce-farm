import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/localization/app_localizations.dart';
import '../../../../core/localization/locale_cubit.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/theme/theme_cubit.dart';
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

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.tr('settings')),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Notifications Section
          _buildSectionTitle(l10n.tr('notifications')),
          _buildSettingCard(
            children: [
              _buildSwitchTile(
                icon: Icons.notifications_outlined,
                title: l10n.tr('push_notifications'),
                subtitle: l10n.tr('push_notifications_desc'),
                value: _notificationsEnabled,
                onChanged: (value) {
                  setState(() => _notificationsEnabled = value);
                  CustomSnackBar.showInfo(
                    context,
                    message: value
                        ? (l10n.isVietnamese
                            ? 'Đã bật thông báo'
                            : 'Notifications enabled')
                        : (l10n.isVietnamese
                            ? 'Đã tắt thông báo'
                            : 'Notifications disabled'),
                  );
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Appearance Section
          _buildSectionTitle(l10n.tr('appearance')),
          _buildSettingCard(
            children: [
              // Dark Mode with ThemeCubit
              BlocBuilder<ThemeCubit, ThemeMode>(
                builder: (context, themeMode) {
                  return _buildSwitchTile(
                    icon: Icons.dark_mode_outlined,
                    title: l10n.tr('dark_mode'),
                    subtitle: l10n.tr('dark_mode_desc'),
                    value: themeMode == ThemeMode.dark,
                    onChanged: (value) {
                      context.read<ThemeCubit>().setTheme(
                            value ? ThemeMode.dark : ThemeMode.light,
                          );
                      CustomSnackBar.showSuccess(
                        context,
                        message: value
                            ? (l10n.isVietnamese
                                ? 'Đã bật chế độ tối'
                                : 'Dark mode enabled')
                            : (l10n.isVietnamese
                                ? 'Đã bật chế độ sáng'
                                : 'Light mode enabled'),
                      );
                    },
                  );
                },
              ),
              const Divider(height: 1),
              // Language with LocaleCubit
              BlocBuilder<LocaleCubit, Locale>(
                builder: (context, locale) {
                  return _buildOptionTile(
                    icon: Icons.language_outlined,
                    title: l10n.tr('language'),
                    subtitle:
                        locale.languageCode == 'vi' ? 'Tiếng Việt' : 'English',
                    onTap: () => _showLanguageDialog(context, locale),
                  );
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Privacy Section
          _buildSectionTitle(l10n.tr('privacy_security')),
          _buildSettingCard(
            children: [
              _buildOptionTile(
                icon: Icons.lock_outline,
                title: l10n.tr('change_password'),
                subtitle: l10n.isVietnamese
                    ? 'Cập nhật mật khẩu tài khoản'
                    : 'Update account password',
                onTap: () => context.push('/change-password'),
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.privacy_tip_outlined,
                title: l10n.tr('privacy_policy'),
                subtitle: l10n.isVietnamese
                    ? 'Xem chính sách bảo mật của chúng tôi'
                    : 'View our privacy policy',
                onTap: () {
                  CustomSnackBar.showInfo(context,
                      message: l10n.tr('feature_developing'));
                },
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.description_outlined,
                title: l10n.tr('terms_of_service'),
                subtitle: l10n.isVietnamese
                    ? 'Xem điều khoản và điều kiện'
                    : 'View terms and conditions',
                onTap: () {
                  CustomSnackBar.showInfo(context,
                      message: l10n.tr('feature_developing'));
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Support Section
          _buildSectionTitle(l10n.tr('support')),
          _buildSettingCard(
            children: [
              _buildOptionTile(
                icon: Icons.help_outline,
                title: l10n.tr('help_center'),
                subtitle: l10n.isVietnamese
                    ? 'Câu hỏi thường gặp và hướng dẫn'
                    : 'FAQs and guides',
                onTap: () {
                  CustomSnackBar.showInfo(context,
                      message: l10n.tr('feature_developing'));
                },
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.support_agent_outlined,
                title: l10n.tr('contact_support'),
                subtitle: l10n.isVietnamese
                    ? 'Gửi yêu cầu hỗ trợ'
                    : 'Send support request',
                onTap: () {
                  CustomSnackBar.showInfo(context,
                      message: l10n.tr('feature_developing'));
                },
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.info_outline,
                title: l10n.tr('about_app'),
                subtitle:
                    l10n.isVietnamese ? 'Phiên bản 1.0.0' : 'Version 1.0.0',
                onTap: _showAboutDialog,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Danger Zone
          _buildSectionTitle(l10n.tr('danger_zone')),
          _buildSettingCard(
            borderColor: AppColors.destructive.withOpacity(0.3),
            children: [
              _buildOptionTile(
                icon: Icons.logout,
                title: l10n.tr('logout'),
                subtitle: l10n.isVietnamese
                    ? 'Đăng xuất khỏi tài khoản'
                    : 'Sign out of your account',
                iconColor: AppColors.destructive,
                textColor: AppColors.destructive,
                onTap: () => _showLogoutDialog(context),
              ),
              const Divider(height: 1),
              _buildOptionTile(
                icon: Icons.delete_forever_outlined,
                title: l10n.tr('delete_account'),
                subtitle: l10n.tr('delete_account_desc'),
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
        color: Theme.of(context).cardColor,
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

  void _showLanguageDialog(BuildContext context, Locale currentLocale) {
    final l10n = AppLocalizations.of(context);

    showDialog(
      context: context,
      builder: (ctx) => SimpleDialog(
        title: Text(l10n.tr('select_language')),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        children: [
          RadioListTile<AppLanguage>(
            title: Row(
              children: [
                const Text('🇻🇳', style: TextStyle(fontSize: 24)),
                const SizedBox(width: 12),
                const Text('Tiếng Việt'),
              ],
            ),
            value: AppLanguage.vietnamese,
            groupValue: context.read<LocaleCubit>().currentLanguage,
            onChanged: (value) {
              if (value != null) {
                context.read<LocaleCubit>().setLocale(value);
                Navigator.pop(ctx);
                CustomSnackBar.showSuccess(
                  context,
                  message: 'Đã chọn Tiếng Việt',
                );
              }
            },
          ),
          RadioListTile<AppLanguage>(
            title: Row(
              children: [
                const Text('🇺🇸', style: TextStyle(fontSize: 24)),
                const SizedBox(width: 12),
                const Text('English'),
              ],
            ),
            value: AppLanguage.english,
            groupValue: context.read<LocaleCubit>().currentLanguage,
            onChanged: (value) {
              if (value != null) {
                context.read<LocaleCubit>().setLocale(value);
                Navigator.pop(ctx);
                CustomSnackBar.showSuccess(
                  context,
                  message: 'Selected English',
                );
              }
            },
          ),
        ],
      ),
    );
  }

  void _showAboutDialog() {
    final l10n = AppLocalizations.of(context);

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
        Text(l10n.isVietnamese
            ? 'Ứng dụng mua bán thuốc bảo vệ thực vật với tư vấn AI'
            : 'Agricultural products e-commerce app with AI consultation'),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(l10n.tr('logout')),
        content: Text(l10n.tr('logout_confirm')),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(l10n.tr('cancel')),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<AuthBloc>().add(const LogoutRequested());
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.destructive),
            child: Text(l10n.tr('logout')),
          ),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(l10n.tr('delete_account')),
        content: Text(l10n.tr('delete_account_warning')),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(l10n.tr('cancel')),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              CustomSnackBar.showInfo(context,
                  message: l10n.tr('feature_developing'));
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.destructive),
            child: Text(l10n.tr('delete_account')),
          ),
        ],
      ),
    );
  }
}
