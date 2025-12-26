import 'package:flutter/material.dart';
import 'en_translations.dart';
import 'vi_translations.dart';

/// App Localizations helper class
class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  /// Get current instance from context
  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations) ??
        AppLocalizations(const Locale('vi'));
  }

  /// Get translation by key
  String translate(String key) {
    final translations =
        locale.languageCode == 'en' ? enTranslations : viTranslations;
    return translations[key] ?? key;
  }

  /// Shorthand for translate
  String tr(String key) => translate(key);

  /// Check if current language is Vietnamese
  bool get isVietnamese => locale.languageCode == 'vi';

  /// Get current language code
  String get languageCode => locale.languageCode;
}

/// Localizations Delegate
class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'vi'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
}

/// Extension for easy access
extension LocalizationExt on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this);
  String tr(String key) => l10n.translate(key);
}
