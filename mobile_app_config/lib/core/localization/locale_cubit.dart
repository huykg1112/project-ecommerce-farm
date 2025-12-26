import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Supported languages
enum AppLanguage {
  vietnamese('vi', 'Tiếng Việt'),
  english('en', 'English');

  final String code;
  final String displayName;

  const AppLanguage(this.code, this.displayName);

  static AppLanguage fromCode(String code) {
    return AppLanguage.values.firstWhere(
      (lang) => lang.code == code,
      orElse: () => AppLanguage.vietnamese,
    );
  }
}

/// Locale Cubit for managing app language
class LocaleCubit extends Cubit<Locale> {
  static const String _localeKey = 'app_locale';
  final SharedPreferences _prefs;

  LocaleCubit(this._prefs) : super(const Locale('vi')) {
    _loadLocale();
  }

  /// Load saved locale from SharedPreferences
  void _loadLocale() {
    final savedLocale = _prefs.getString(_localeKey);
    if (savedLocale != null) {
      emit(Locale(savedLocale));
    }
  }

  /// Set locale
  Future<void> setLocale(AppLanguage language) async {
    await _prefs.setString(_localeKey, language.code);
    emit(Locale(language.code));
  }

  /// Get current language
  AppLanguage get currentLanguage => AppLanguage.fromCode(state.languageCode);

  /// Check if current language is Vietnamese
  bool get isVietnamese => state.languageCode == 'vi';
}
