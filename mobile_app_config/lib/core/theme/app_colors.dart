import 'package:flutter/material.dart';

/// App color palette matching web frontend theme
/// Primary colors based on agricultural green theme (#599146)
class AppColors {
  AppColors._(); // Private constructor to prevent instantiation

  // Primary Colors (Green theme for agriculture)
  static const Color primary = Color(0xFF599146);
  static const Color primaryLight = Color(0xFF90C577);
  static const Color primaryLighter = Color(0xFFACCC8B);
  static const Color primaryDark = Color(0xFF44703D);
  static const Color primaryForeground = Color(0xFFFFFFFF);

  // Secondary Colors
  static const Color secondary = Color(0xFF74A65D);
  static const Color secondaryForeground = Color(0xFFFFFFFF);

  // Neutral Colors - Light Theme
  static const Color background = Color(0xFFFFFFFF);
  static const Color foreground = Color(0xFF0F172A);
  static const Color card = Color(0xFFFFFFFF);
  static const Color cardForeground = Color(0xFF0F172A);

  // Neutral Colors - Dark Theme
  static const Color backgroundDark = Color(0xFF0F172A);
  static const Color foregroundDark = Color(0xFFF8FAFC);
  static const Color cardDark = Color(0xFF1E293B);
  static const Color cardForegroundDark = Color(0xFFF8FAFC);

  // Semantic Colors
  static const Color destructive = Color(0xFFEF4444);
  static const Color destructiveForeground = Color(0xFFFFFFFF);
  static const Color success = Color(0xFF22C55E);
  static const Color successForeground = Color(0xFFFFFFFF);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningForeground = Color(0xFFFFFFFF);
  static const Color info = Color(0xFF3B82F6);
  static const Color infoForeground = Color(0xFFFFFFFF);

  // Border & Input
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderDark = Color(0xFF334155);
  static const Color input = Color(0xFFE2E8F0);
  static const Color inputDark = Color(0xFF334155);
  static const Color ring = Color(0xFF0F172A);
  static const Color ringDark = Color(0xFFF1F5F9);

  // Muted
  static const Color muted = Color(0xFFF1F5F9);
  static const Color mutedForeground = Color(0xFF64748B);
  static const Color mutedDark = Color(0xFF1E293B);
  static const Color mutedForegroundDark = Color(0xFF94A3B8);

  // Accent
  static const Color accent = Color(0xFFF1F5F9);
  static const Color accentForeground = Color(0xFF0F172A);
  static const Color accentDark = Color(0xFF1E293B);
  static const Color accentForegroundDark = Color(0xFFF8FAFC);

  // Additional Helpers
  static const Color divider = Color(0xFFE2E8F0);
  static const Color dividerDark = Color(0xFF334155);
  static const Color shadow = Color(0x1A000000);
  static const Color overlay = Color(0x80000000);

  // Gradient colors for special effects
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, primaryDark],
  );

  static const LinearGradient lightGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryLighter, primaryLight],
  );
}
