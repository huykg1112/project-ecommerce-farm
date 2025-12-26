import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

/// Custom text field with consistent styling
class AppTextField extends StatefulWidget {
  final TextEditingController? controller;
  final String? label;
  final String? hint;
  final String? errorText;
  final String? helperText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool obscureText;
  final bool enabled;
  final bool readOnly;
  final bool autofocus;
  final int? maxLines;
  final int? minLines;
  final int? maxLength;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final List<TextInputFormatter>? inputFormatters;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;
  final ValueChanged<String>? onSubmitted;
  final FocusNode? focusNode;
  final String? Function(String?)? validator;
  final AutovalidateMode? autovalidateMode;
  final EdgeInsets? contentPadding;
  final bool showPasswordToggle;

  const AppTextField({
    super.key,
    this.controller,
    this.label,
    this.hint,
    this.errorText,
    this.helperText,
    this.prefixIcon,
    this.suffixIcon,
    this.obscureText = false,
    this.enabled = true,
    this.readOnly = false,
    this.autofocus = false,
    this.maxLines = 1,
    this.minLines,
    this.maxLength,
    this.keyboardType,
    this.textInputAction,
    this.inputFormatters,
    this.onChanged,
    this.onTap,
    this.onSubmitted,
    this.focusNode,
    this.validator,
    this.autovalidateMode,
    this.contentPadding,
    this.showPasswordToggle = false,
  });

  /// Email input field
  factory AppTextField.email({
    TextEditingController? controller,
    String? label,
    String? errorText,
    ValueChanged<String>? onChanged,
    String? Function(String?)? validator,
    bool enabled = true,
  }) {
    return AppTextField(
      controller: controller,
      label: label ?? 'Email',
      hint: 'example@email.com',
      keyboardType: TextInputType.emailAddress,
      textInputAction: TextInputAction.next,
      prefixIcon: const Icon(Icons.email_outlined),
      errorText: errorText,
      onChanged: onChanged,
      validator: validator,
      enabled: enabled,
    );
  }

  /// Password input field with visibility toggle
  factory AppTextField.password({
    TextEditingController? controller,
    String? label,
    String? errorText,
    ValueChanged<String>? onChanged,
    String? Function(String?)? validator,
    TextInputAction? textInputAction,
  }) {
    return AppTextField(
      controller: controller,
      label: label ?? 'Mật khẩu',
      hint: 'Nhập mật khẩu',
      obscureText: true,
      showPasswordToggle: true,
      keyboardType: TextInputType.visiblePassword,
      textInputAction: textInputAction ?? TextInputAction.done,
      prefixIcon: const Icon(Icons.lock_outlined),
      errorText: errorText,
      onChanged: onChanged,
      validator: validator,
    );
  }

  /// Phone number input field
  factory AppTextField.phone({
    TextEditingController? controller,
    String? label,
    String? errorText,
    ValueChanged<String>? onChanged,
    String? Function(String?)? validator,
  }) {
    return AppTextField(
      controller: controller,
      label: label ?? 'Số điện thoại',
      hint: '0123 456 789',
      keyboardType: TextInputType.phone,
      textInputAction: TextInputAction.next,
      prefixIcon: const Icon(Icons.phone_outlined),
      errorText: errorText,
      onChanged: onChanged,
      validator: validator,
      inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
        LengthLimitingTextInputFormatter(11),
      ],
    );
  }

  /// Search input field
  factory AppTextField.search({
    TextEditingController? controller,
    String? hint,
    ValueChanged<String>? onChanged,
    ValueChanged<String>? onSubmitted,
    VoidCallback? onClear,
  }) {
    return AppTextField(
      controller: controller,
      hint: hint ?? 'Tìm kiếm...',
      keyboardType: TextInputType.text,
      textInputAction: TextInputAction.search,
      prefixIcon: const Icon(Icons.search),
      onChanged: onChanged,
      onSubmitted: onSubmitted,
      suffixIcon: controller?.text.isNotEmpty == true
          ? IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                controller?.clear();
                onClear?.call();
              },
            )
          : null,
    );
  }

  /// Multiline text area
  factory AppTextField.multiline({
    TextEditingController? controller,
    String? label,
    String? hint,
    String? errorText,
    int maxLines = 4,
    int? maxLength,
    ValueChanged<String>? onChanged,
    String? Function(String?)? validator,
  }) {
    return AppTextField(
      controller: controller,
      label: label,
      hint: hint,
      errorText: errorText,
      maxLines: maxLines,
      maxLength: maxLength,
      keyboardType: TextInputType.multiline,
      textInputAction: TextInputAction.newline,
      onChanged: onChanged,
      validator: validator,
    );
  }

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  late bool _obscureText;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.obscureText;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: AppTextStyles.labelMedium.copyWith(
              color: AppColors.foreground,
            ),
          ),
          const SizedBox(height: 6),
        ],
        TextFormField(
          controller: widget.controller,
          focusNode: widget.focusNode,
          obscureText: _obscureText,
          enabled: widget.enabled,
          readOnly: widget.readOnly,
          autofocus: widget.autofocus,
          maxLines: widget.obscureText ? 1 : widget.maxLines,
          minLines: widget.minLines,
          maxLength: widget.maxLength,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          inputFormatters: widget.inputFormatters,
          onChanged: widget.onChanged,
          onTap: widget.onTap,
          onFieldSubmitted: widget.onSubmitted,
          validator: widget.validator,
          autovalidateMode: widget.autovalidateMode,
          style: AppTextStyles.bodyMedium,
          decoration: InputDecoration(
            hintText: widget.hint,
            errorText: widget.errorText,
            helperText: widget.helperText,
            prefixIcon: widget.prefixIcon,
            suffixIcon: _buildSuffixIcon(),
            contentPadding: widget.contentPadding,
          ),
        ),
      ],
    );
  }

  Widget? _buildSuffixIcon() {
    if (widget.showPasswordToggle && widget.obscureText) {
      return IconButton(
        icon: Icon(
          _obscureText
              ? Icons.visibility_outlined
              : Icons.visibility_off_outlined,
          color: AppColors.mutedForeground,
        ),
        onPressed: () {
          setState(() {
            _obscureText = !_obscureText;
          });
        },
      );
    }
    return widget.suffixIcon;
  }
}
