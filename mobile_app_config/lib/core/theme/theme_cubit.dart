import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Theme state
enum AppThemeMode { light, dark, system }

/// Theme Cubit for managing app theme
class ThemeCubit extends Cubit<ThemeMode> {
  static const String _themeKey = 'app_theme_mode';
  final SharedPreferences _prefs;

  ThemeCubit(this._prefs) : super(ThemeMode.system) {
    _loadTheme();
  }

  /// Load saved theme from SharedPreferences
  void _loadTheme() {
    final savedTheme = _prefs.getString(_themeKey);
    if (savedTheme != null) {
      switch (savedTheme) {
        case 'light':
          emit(ThemeMode.light);
          break;
        case 'dark':
          emit(ThemeMode.dark);
          break;
        default:
          emit(ThemeMode.system);
      }
    }
  }

  /// Set theme mode
  Future<void> setTheme(ThemeMode mode) async {
    String themeString;
    switch (mode) {
      case ThemeMode.light:
        themeString = 'light';
        break;
      case ThemeMode.dark:
        themeString = 'dark';
        break;
      case ThemeMode.system:
        themeString = 'system';
        break;
    }
    await _prefs.setString(_themeKey, themeString);
    emit(mode);
  }

  /// Toggle between light and dark mode
  Future<void> toggleTheme() async {
    if (state == ThemeMode.dark) {
      await setTheme(ThemeMode.light);
    } else {
      await setTheme(ThemeMode.dark);
    }
  }

  /// Check if dark mode is enabled
  bool get isDarkMode => state == ThemeMode.dark;
}
