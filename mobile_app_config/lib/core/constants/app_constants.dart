/// Application-wide constants
class AppConstants {
  AppConstants._();

  // App Info
  static const String appName = 'FarmCommerce';
  static const String appVersion = '1.0.0';

  // Storage Keys
  static const String keyAccessToken = 'access_token';
  static const String keyRefreshToken = 'refresh_token';
  static const String keyUserId = 'user_id';
  static const String keyUserData = 'user_data';
  static const String keyIsLoggedIn = 'is_logged_in';
  static const String keyThemeMode = 'theme_mode';
  static const String keyLanguage = 'language';
  static const String keyOnboardingCompleted = 'onboarding_completed';
  static const String keyFcmToken = 'fcm_token';

  // Hive Box Names
  static const String authBox = 'auth_box';
  static const String userBox = 'user_box';
  static const String cartBox = 'cart_box';
  static const String productBox = 'product_box';
  static const String cacheBox = 'cache_box';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 50;

  // Image
  static const int maxImageSizeBytes = 5 * 1024 * 1024; // 5MB
  static const double imageQuality = 0.8;
  static const List<String> allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  // Validation
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 50;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 30;
  static const int maxDescriptionLength = 5000;

  // Currency
  static const String currency = 'đ';
  static const String currencyCode = 'VND';

  // Date Format
  static const String dateFormat = 'dd/MM/yyyy';
  static const String dateTimeFormat = 'dd/MM/yyyy HH:mm';
  static const String timeFormat = 'HH:mm';

  // Maps
  static const double defaultLatitude = 10.8231; // Ho Chi Minh City
  static const double defaultLongitude = 106.6297;
  static const double defaultZoom = 15.0;
  static const double nearbyStoresRadius = 10.0; // km

  // Rating
  static const double minRating = 1.0;
  static const double maxRating = 5.0;

  // Cache Duration
  static const Duration shortCacheDuration = Duration(minutes: 5);
  static const Duration mediumCacheDuration = Duration(hours: 1);
  static const Duration longCacheDuration = Duration(days: 1);

  // Debounce/Throttle
  static const Duration searchDebounce = Duration(milliseconds: 500);
  static const Duration autoSaveDuration = Duration(seconds: 3);

  // Animation Duration
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);

  // Carousel
  static const Duration autoPlayDuration = Duration(seconds: 5);
  static const Duration carouselTransitionDuration = Duration(milliseconds: 800);

  // App Links
  static const String privacyPolicyUrl = 'https://farmcommerce.com/privacy';
  static const String termsOfServiceUrl = 'https://farmcommerce.com/terms';
  static const String supportEmail = 'support@farmcommerce.com';
  static const String supportPhone = '+84 123 456 789';

  // Social Media
  static const String facebookUrl = 'https://facebook.com/farmcommerce';
  static const String instagramUrl = 'https://instagram.com/farmcommerce';
  static const String youtubeUrl = 'https://youtube.com/farmcommerce';

  // VNPay Test Credentials (for development)
  static const String vnpayTestBankCode = 'NCB';
  static const String vnpayTestCardNumber = '9704198526191432198';
  static const String vnpayTestCardName = 'NGUYEN VAN A';
  static const String vnpayTestExpiry = '07/15';
  static const String vnpayTestOtp = '123456';
}
