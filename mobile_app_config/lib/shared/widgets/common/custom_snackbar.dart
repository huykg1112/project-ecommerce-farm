import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

/// Custom snackbar utility class
class CustomSnackBar {
  CustomSnackBar._();

  /// Show success snackbar
  static void showSuccess(
    BuildContext context, {
    required String message,
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    _show(
      context,
      message: message,
      backgroundColor: AppColors.success,
      icon: Icons.check_circle,
      duration: duration,
      action: action,
    );
  }

  /// Show error snackbar
  static void showError(
    BuildContext context, {
    required String message,
    Duration duration = const Duration(seconds: 4),
    SnackBarAction? action,
  }) {
    _show(
      context,
      message: message,
      backgroundColor: AppColors.destructive,
      icon: Icons.error,
      duration: duration,
      action: action,
    );
  }

  /// Show warning snackbar
  static void showWarning(
    BuildContext context, {
    required String message,
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    _show(
      context,
      message: message,
      backgroundColor: AppColors.warning,
      icon: Icons.warning,
      duration: duration,
      action: action,
    );
  }

  /// Show info snackbar
  static void showInfo(
    BuildContext context, {
    required String message,
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    _show(
      context,
      message: message,
      backgroundColor: AppColors.info,
      icon: Icons.info,
      duration: duration,
      action: action,
    );
  }

  /// Show loading snackbar (with progress indicator)
  static ScaffoldFeatureController<SnackBar, SnackBarClosedReason> showLoading(
    BuildContext context, {
    required String message,
  }) {
    final snackBar = SnackBar(
      content: Row(
        children: [
          const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      backgroundColor: AppColors.primary,
      duration: const Duration(
          minutes: 1), // Long duration, will be dismissed manually
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    );

    return ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  /// Hide current snackbar
  static void hide(BuildContext context) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
  }

  /// Private method to show snackbar
  static void _show(
    BuildContext context, {
    required String message,
    required Color backgroundColor,
    required IconData icon,
    required Duration duration,
    SnackBarAction? action,
  }) {
    // Hide any existing snackbar
    ScaffoldMessenger.of(context).hideCurrentSnackBar();

    final snackBar = SnackBar(
      content: Row(
        children: [
          Icon(
            icon,
            color: Colors.white,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      backgroundColor: backgroundColor,
      duration: duration,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      action: action,
      margin: const EdgeInsets.all(16),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }
}

/// Extension on BuildContext for easier snackbar access
extension SnackBarExtension on BuildContext {
  void showSuccessSnackBar(String message) {
    CustomSnackBar.showSuccess(this, message: message);
  }

  void showErrorSnackBar(String message) {
    CustomSnackBar.showError(this, message: message);
  }

  void showWarningSnackBar(String message) {
    CustomSnackBar.showWarning(this, message: message);
  }

  void showInfoSnackBar(String message) {
    CustomSnackBar.showInfo(this, message: message);
  }

  void hideSnackBar() {
    CustomSnackBar.hide(this);
  }
}
