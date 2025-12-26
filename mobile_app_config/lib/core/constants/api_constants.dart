/// API endpoint constants
///
/// These endpoints are mapped from BackendV2 (NestJS) API
/// Base URL: http://localhost:4200 (change for production)
class ApiConstants {
  ApiConstants._();

  // ==========================================================================
  // BASE URL CONFIGURATION
  // ==========================================================================

  /// For physical devices, use the computer's IP address instead of localhost
  /// Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to get your IP
  // static const String baseUrl = 'http://192.168.110.63:4200';
  static const String baseUrl = 'http://10.1.2.31:4200';

  // Timeout durations
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);

  // ==========================================================================
  // AUTH ENDPOINTS
  // ==========================================================================

  static const String login = '/auth/login';
  static const String register = '/user/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String googleAuth = '/auth/google';
  static const String googleCallback = '/auth/google/callback';

  // ==========================================================================
  // USER ENDPOINTS
  // ==========================================================================

  static const String users = '/user';
  static const String userProfile = '/user/profile';
  static const String getCurrentUser = '/user/profile';
  static const String updateProfile = '/user/updateProfile';
  static const String changePassword = '/user/changePassword';
  static const String uploadAvatar = '/user/avatar';
  static const String userAddresses = '/address';
  static const String addAddress = '/address';
  static const String updateAddress = '/address/{id}';
  static const String deleteAddress = '/address/{id}';
  static const String setDefaultAddress = '/address/{id}/default';

  // ==========================================================================
  // PRODUCT ENDPOINTS
  // ==========================================================================

  static const String products = '/products';
  static const String productsForUsers = '/products/for-users';
  static const String productDetail = '/products/{id}';
  static const String searchProducts = '/products/search';
  static const String advancedSearch = '/products/advanced-search';
  static const String featuredProducts = '/products/featured';
  static const String recommendations = '/products/recommendations';
  static const String popularProducts = '/products/popular';
  static const String productsByCategory = '/products/category/{categoryId}';
  static const String productsByDisease = '/products/disease/{diseaseId}';

  // ==========================================================================
  // CATEGORY ENDPOINTS
  // ==========================================================================

  static const String categories = '/categories';
  static const String categoryDetail = '/categories/{id}';

  // ==========================================================================
  // BATCH PRODUCT ENDPOINTS (Lô hàng)
  // ==========================================================================

  static const String batchProducts = '/batch-products';
  static const String batchProductDetail = '/batch-products/{id}';
  static const String batchProductsByProduct =
      '/batch-products/product/{productId}';
  static const String lowStockBatches = '/batch-products/low-stock';
  static const String expiringBatches = '/batch-products/expiring';

  // ==========================================================================
  // CART ENDPOINTS
  // ==========================================================================

  static const String cart = '/cart';
  static const String addToCart = '/cart/add';
  static const String updateCart = '/cart/update';
  static const String removeFromCart = '/cart/{id}';
  static const String clearCart = '/cart/clear';
  static const String cartItemCount = '/cart/count';

  // ==========================================================================
  // ORDER ENDPOINTS
  // ==========================================================================

  static const String orders = '/orders';
  static const String createOrder = '/orders';
  static const String orderDetail = '/orders/{id}';
  static const String cancelOrder = '/orders/{id}/cancel';
  static const String orderHistory = '/orders/history';
  static const String ordersByUser = '/orders/user';
  static const String updateOrderStatus = '/orders/{id}/status';

  // ==========================================================================
  // ORDER STATUS ENDPOINTS
  // ==========================================================================

  static const String orderStatuses = '/order-status';
  static const String orderStatusDetail = '/order-status/{id}';

  // ==========================================================================
  // PAYMENT METHOD ENDPOINTS
  // ==========================================================================

  static const String paymentMethods = '/payment-method';
  static const String paymentMethodDetail = '/payment-method/{id}';

  // ==========================================================================
  // VNPAY PAYMENT ENDPOINTS
  // ==========================================================================

  static const String vnpayCreatePaymentUrl =
      '/payment/vnpay/create-payment-url';
  static const String vnpayReturn = '/payment/vnpay/return';
  static const String vnpayIpn = '/payment/vnpay/ipn';
  static const String vnpayStatus = '/payment/vnpay/status/{orderId}';

  // Legacy payment endpoints (for backwards compatibility)
  static const String createPayment = '/payment/create';
  static const String paymentCallback = '/payment/callback';
  static const String verifyPayment = '/payment/verify/{orderId}';

  // ==========================================================================
  // REVIEW ENDPOINTS
  // ==========================================================================

  static const String reviews = '/reviews';
  static const String productReviews = '/reviews/product/{productId}';
  static const String submitReview = '/reviews';
  static const String updateReview = '/reviews/{id}';
  static const String deleteReview = '/reviews/{id}';
  static const String userReviews = '/reviews/user';
  static const String reviewStats = '/reviews/stats/{productId}';

  // ==========================================================================
  // WISHLIST/FAVORITES ENDPOINTS
  // ==========================================================================

  static const String favorites = '/favorites';
  static const String addToFavorites = '/favorites/add';
  static const String removeFromFavorites = '/favorites/{productId}';
  static const String checkFavorite = '/favorites/check/{productId}';

  // ==========================================================================
  // AI CONSULTATION ENDPOINTS
  // ==========================================================================

  static const String aiConsultation = '/ai-consultation';
  static const String aiDiagnose = '/ai-consultation/diagnose';
  static const String consultations = '/ai-consultation';
  static const String consultationDetail = '/ai-consultation/{id}';
  static const String treatmentPlan = '/treatment-plan/{id}';
  static const String treatmentPlans = '/treatment-plan';

  // ==========================================================================
  // DISEASE ENDPOINTS
  // ==========================================================================

  static const String diseases = '/diseases';
  static const String diseaseDetail = '/diseases/{id}';
  static const String diseaseByName = '/diseases/name/{name}';

  // ==========================================================================
  // ACTIVE INGREDIENT ENDPOINTS
  // ==========================================================================

  static const String activeIngredients = '/active-ingredient';
  static const String activeIngredientDetail = '/active-ingredient/{id}';

  // ==========================================================================
  // INVENTORY/STORE ENDPOINTS
  // ==========================================================================

  static const String inventories = '/invenstory';
  static const String inventoryDetail = '/invenstory/{id}';
  static const String stores = '/invenstory';
  static const String nearbyStores = '/invenstory/nearby';
  static const String storeDetail = '/invenstory/{id}';

  // ==========================================================================
  // STORE OWNER REQUEST ENDPOINTS
  // ==========================================================================

  static const String storeOwnerRequests = '/store-owner-request';
  static const String registerDealer = '/store-owner-request';
  static const String storeOwnerRequestDetail = '/store-owner-request/{id}';
  static const String approveStoreRequest = '/store-owner-request/{id}/approve';
  static const String rejectStoreRequest = '/store-owner-request/{id}/reject';

  // ==========================================================================
  // VOUCHER ENDPOINTS
  // ==========================================================================

  static const String vouchers = '/vouchers';
  static const String voucherDetail = '/vouchers/{id}';
  static const String voucherByCode = '/vouchers/code/{code}';
  static const String applyVoucher = '/vouchers/apply';
  static const String userVouchers = '/vouchers/user';

  // ==========================================================================
  // PROMOTION ENDPOINTS
  // ==========================================================================

  static const String promotions = '/promotions';
  static const String promotionDetail = '/promotions/{id}';
  static const String activePromotions = '/promotions/active';

  // ==========================================================================
  // MANUFACTURER ENDPOINTS
  // ==========================================================================

  static const String manufacturers = '/manufacturers';
  static const String manufacturerDetail = '/manufacturers/{id}';

  // ==========================================================================
  // PRODUCT TYPE ENDPOINTS
  // ==========================================================================

  static const String productTypes = '/product-type';
  static const String productTypeDetail = '/product-type/{id}';

  // ==========================================================================
  // NOTIFICATION ENDPOINTS
  // ==========================================================================

  static const String notifications = '/notifications';
  static const String notificationDetail = '/notifications/{id}';
  static const String markAsRead = '/notifications/{id}/read';
  static const String markAllAsRead = '/notifications/read-all';
  static const String registerFcmToken = '/notifications/fcm-token';
  static const String unreadCount = '/notifications/unread-count';

  // ==========================================================================
  // BANNER/SLIDER ENDPOINTS
  // ==========================================================================

  static const String banners = '/banners';
  static const String activeBanners = '/banners/active';

  // ==========================================================================
  // ROLE ENDPOINTS
  // ==========================================================================

  static const String roles = '/roles';
  static const String roleDetail = '/roles/{id}';

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /// Replace path parameters with actual values
  ///
  /// Example:
  /// ```dart
  /// final path = ApiConstants.replacePath(
  ///   ApiConstants.productDetail,
  ///   {'id': '123'},
  /// );
  /// // Result: '/products/123'
  /// ```
  static String replacePath(String path, Map<String, dynamic> params) {
    String result = path;
    params.forEach((key, value) {
      result = result.replaceAll('{$key}', value.toString());
    });
    return result;
  }

  /// Build query string from parameters
  ///
  /// Example:
  /// ```dart
  /// final query = ApiConstants.buildQuery({
  ///   'page': 1,
  ///   'limit': 10,
  ///   'search': 'keyword',
  /// });
  /// // Result: '?page=1&limit=10&search=keyword'
  /// ```
  static String buildQuery(Map<String, dynamic> params) {
    if (params.isEmpty) return '';

    final queryParts = <String>[];
    params.forEach((key, value) {
      if (value != null) {
        queryParts.add('$key=${Uri.encodeComponent(value.toString())}');
      }
    });

    return queryParts.isNotEmpty ? '?${queryParts.join('&')}' : '';
  }
}
