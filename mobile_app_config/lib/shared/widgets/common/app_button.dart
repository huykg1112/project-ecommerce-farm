import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

/// Customizable app button with multiple variants
class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final Widget? icon;
  final bool isLoading;
  final bool isFullWidth;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final BorderRadius? borderRadius;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.backgroundColor,
    this.foregroundColor,
    this.borderRadius,
  });

  /// Primary filled button
  factory AppButton.primary({
    required String text,
    VoidCallback? onPressed,
    ButtonSize size = ButtonSize.medium,
    Widget? icon,
    bool isLoading = false,
    bool isFullWidth = false,
  }) {
    return AppButton(
      text: text,
      onPressed: onPressed,
      variant: ButtonVariant.primary,
      size: size,
      icon: icon,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
    );
  }

  /// Secondary/outline button
  factory AppButton.secondary({
    required String text,
    VoidCallback? onPressed,
    ButtonSize size = ButtonSize.medium,
    Widget? icon,
    bool isLoading = false,
    bool isFullWidth = false,
  }) {
    return AppButton(
      text: text,
      onPressed: onPressed,
      variant: ButtonVariant.secondary,
      size: size,
      icon: icon,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
    );
  }

  /// Text button
  factory AppButton.text({
    required String text,
    VoidCallback? onPressed,
    ButtonSize size = ButtonSize.medium,
    Widget? icon,
    bool isLoading = false,
  }) {
    return AppButton(
      text: text,
      onPressed: onPressed,
      variant: ButtonVariant.text,
      size: size,
      icon: icon,
      isLoading: isLoading,
    );
  }

  /// Destructive/danger button
  factory AppButton.destructive({
    required String text,
    VoidCallback? onPressed,
    ButtonSize size = ButtonSize.medium,
    Widget? icon,
    bool isLoading = false,
    bool isFullWidth = false,
  }) {
    return AppButton(
      text: text,
      onPressed: onPressed,
      variant: ButtonVariant.destructive,
      size: size,
      icon: icon,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
    );
  }

  @override
  Widget build(BuildContext context) {
    final buttonSize = _getButtonSize();
    final buttonStyle = _getButtonStyle();

    Widget buttonChild = Row(
      mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                _getForegroundColor(),
              ),
            ),
          ),
          const SizedBox(width: 8),
        ] else if (icon != null) ...[
          icon!,
          const SizedBox(width: 8),
        ],
        Flexible(
          child: Text(
            text,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ],
    );

    Widget button;
    switch (variant) {
      case ButtonVariant.primary:
      case ButtonVariant.destructive:
        button = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: buttonStyle,
          child: buttonChild,
        );
        break;
      case ButtonVariant.secondary:
        button = OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: buttonStyle,
          child: buttonChild,
        );
        break;
      case ButtonVariant.text:
        button = TextButton(
          onPressed: isLoading ? null : onPressed,
          style: buttonStyle,
          child: buttonChild,
        );
        break;
    }

    if (isFullWidth) {
      return SizedBox(
        width: double.infinity,
        height: buttonSize.height,
        child: button,
      );
    }

    return SizedBox(
      height: buttonSize.height,
      child: button,
    );
  }

  ButtonStyle _getButtonStyle() {
    final bgColor = backgroundColor ?? _getBackgroundColor();
    final fgColor = foregroundColor ?? _getForegroundColor();
    final radius = borderRadius ?? BorderRadius.circular(8);

    switch (variant) {
      case ButtonVariant.primary:
        return ElevatedButton.styleFrom(
          backgroundColor: bgColor,
          foregroundColor: fgColor,
          shape: RoundedRectangleBorder(borderRadius: radius),
          elevation: 0,
          textStyle: AppTextStyles.button,
        );
      case ButtonVariant.destructive:
        return ElevatedButton.styleFrom(
          backgroundColor: AppColors.destructive,
          foregroundColor: AppColors.destructiveForeground,
          shape: RoundedRectangleBorder(borderRadius: radius),
          elevation: 0,
          textStyle: AppTextStyles.button,
        );
      case ButtonVariant.secondary:
        return OutlinedButton.styleFrom(
          foregroundColor: bgColor,
          side: BorderSide(color: bgColor, width: 1.5),
          shape: RoundedRectangleBorder(borderRadius: radius),
          textStyle: AppTextStyles.button,
        );
      case ButtonVariant.text:
        return TextButton.styleFrom(
          foregroundColor: bgColor,
          shape: RoundedRectangleBorder(borderRadius: radius),
          textStyle: AppTextStyles.button,
        );
    }
  }

  Color _getBackgroundColor() {
    switch (variant) {
      case ButtonVariant.primary:
        return AppColors.primary;
      case ButtonVariant.secondary:
        return AppColors.primary;
      case ButtonVariant.destructive:
        return AppColors.destructive;
      case ButtonVariant.text:
        return AppColors.primary;
    }
  }

  Color _getForegroundColor() {
    switch (variant) {
      case ButtonVariant.primary:
        return AppColors.primaryForeground;
      case ButtonVariant.secondary:
        return AppColors.primary;
      case ButtonVariant.destructive:
        return AppColors.destructiveForeground;
      case ButtonVariant.text:
        return AppColors.primary;
    }
  }

  _ButtonSize _getButtonSize() {
    switch (size) {
      case ButtonSize.small:
        return const _ButtonSize(
            height: 40,
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8));
      case ButtonSize.medium:
        return const _ButtonSize(
            height: 48,
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12));
      case ButtonSize.large:
        return const _ButtonSize(
            height: 56,
            padding: EdgeInsets.symmetric(horizontal: 28, vertical: 14));
    }
  }
}

enum ButtonVariant { primary, secondary, destructive, text }

enum ButtonSize { small, medium, large }

class _ButtonSize {
  final double height;
  final EdgeInsets padding;

  const _ButtonSize({required this.height, required this.padding});
}
