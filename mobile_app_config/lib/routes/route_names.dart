/// Route names constants
class RouteNames {
  RouteNames._();

  // Auth Routes
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';

  // Main Routes
  static const String home = '/home';
  static const String search = '/search';
  static const String notifications = '/notifications';
  static const String profile = '/profile';

  // Product Routes
  static const String products = '/products';
  static const String productDetail = '/products/:id';
  static const String productsByCategory = '/products/category/:categoryId';

  // Cart & Checkout
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String orderSuccess = '/order-success';

  // Orders
  static const String orders = '/orders';
  static const String orderDetail = '/orders/:id';

  // AI Consultation
  static const String aiConsultation = '/ai-consultation';
  static const String treatmentPlan = '/treatment-plan/:id';

  // Profile & Settings
  static const String editProfile = '/profile/edit';
  static const String addresses = '/addresses';
  static const String changePassword = '/change-password';
  static const String settings = '/settings';

  // Wishlist
  static const String wishlist = '/wishlist';

  // Store Locator
  static const String storeLocator = '/store-locator';
  static const String storeDetail = '/stores/:id';

  // Dealer
  static const String dealerRegistration = '/dealer/register';
  static const String dealerDashboard = '/dealer/dashboard';
  static const String dealerInventory = '/dealer/inventory';
  static const String dealerOrders = '/dealer/orders';

  // Helper method to replace path parameters
  static String replaceParams(String path, Map<String, String> params) {
    String result = path;
    params.forEach((key, value) {
      result = result.replaceAll(':$key', value);
    });
    return result;
  }
}
