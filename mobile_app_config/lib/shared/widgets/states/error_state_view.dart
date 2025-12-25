import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

/// Error state view for displaying error messages with retry option
class ErrorStateView extends StatelessWidget {
  final String title;
  final String? message;
  final IconData? icon;
  final VoidCallback? onRetry;
  final String retryText;
  final double iconSize;
  final Color? iconColor;

  const ErrorStateView({
    super.key,
    required this.title,
    this.message,
    this.icon,
    this.onRetry,
    this.retryText = 'Thử lại',
    this.iconSize = 80,
    this.iconColor,
  });

  /// Factory for network error
  factory ErrorStateView.networkError({VoidCallback? onRetry}) {
    return ErrorStateView(
      title: 'Không có kết nối mạng',
      message: 'Vui lòng kiểm tra kết nối internet và thử lại',
      icon: Icons.wifi_off,
      onRetry: onRetry,
    );
  }

  /// Factory for server error
  factory ErrorStateView.serverError({VoidCallback? onRetry}) {
    return ErrorStateView(
      title: 'Lỗi máy chủ',
      message: 'Đã xảy ra lỗi. Vui lòng thử lại sau',
      icon: Icons.cloud_off,
      onRetry: onRetry,
    );
  }

  /// Factory for generic error
  factory ErrorStateView.genericError({
    String? message,
    VoidCallback? onRetry,
  }) {
    return ErrorStateView(
      title: 'Đã xảy ra lỗi',
      message: message ?? 'Vui lòng thử lại sau',
      icon: Icons.error_outline,
      onRetry: onRetry,
    );
  }

  /// Factory for not found error
  factory ErrorStateView.notFound({
    String? message,
    VoidCallback? onGoBack,
  }) {
    return ErrorStateView(
      title: 'Không tìm thấy',
      message: message ?? 'Nội dung bạn tìm không tồn tại hoặc đã bị xóa',
      icon: Icons.search_off,
      onRetry: onGoBack,
      retryText: 'Quay lại',
    );
  }

  /// Factory for permission denied error
  factory ErrorStateView.permissionDenied({VoidCallback? onRequestPermission}) {
    return ErrorStateView(
      title: 'Không có quyền truy cập',
      message: 'Bạn cần cấp quyền để sử dụng tính năng này',
      icon: Icons.lock_outline,
      onRetry: onRequestPermission,
      retryText: 'Cấp quyền',
    );
  }

  /// Factory for session expired
  factory ErrorStateView.sessionExpired({VoidCallback? onLogin}) {
    return ErrorStateView(
      title: 'Phiên đăng nhập hết hạn',
      message: 'Vui lòng đăng nhập lại để tiếp tục',
      icon: Icons.login,
      onRetry: onLogin,
      retryText: 'Đăng nhập',
    );
  }

  /// Factory for timeout error
  factory ErrorStateView.timeout({VoidCallback? onRetry}) {
    return ErrorStateView(
      title: 'Hết thời gian chờ',
      message: 'Kết nối đến máy chủ quá lâu. Vui lòng thử lại',
      icon: Icons.timer_off,
      onRetry: onRetry,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Error icon
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.destructive.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon ?? Icons.error_outline,
                size: iconSize,
                color: iconColor ?? AppColors.destructive,
              ),
            ),

            const SizedBox(height: 24),

            // Title
            Text(
              title,
              style: AppTextStyles.h3.copyWith(
                color: AppColors.foreground,
              ),
              textAlign: TextAlign.center,
            ),

            // Message
            if (message != null) ...[
              const SizedBox(height: 8),
              Text(
                message!,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.mutedForeground,
                ),
                textAlign: TextAlign.center,
              ),
            ],

            // Retry button
            if (onRetry != null) ...[
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: Text(retryText),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Inline error message widget (for smaller error displays)
class InlineErrorMessage extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;
  final EdgeInsets padding;

  const InlineErrorMessage({
    super.key,
    required this.message,
    this.onRetry,
    this.padding = const EdgeInsets.all(16),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: AppColors.destructive.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: AppColors.destructive.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.error_outline,
            color: AppColors.destructive,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.destructive,
              ),
            ),
          ),
          if (onRetry != null)
            IconButton(
              icon: const Icon(Icons.refresh, size: 20),
              color: AppColors.destructive,
              onPressed: onRetry,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
        ],
      ),
    );
  }
}
