import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../injection_container.dart';
import 'route_names.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';
import '../features/auth/presentation/pages/splash_page.dart';
import '../features/auth/presentation/pages/login_page.dart';
import '../features/auth/presentation/pages/register_page.dart';
import '../features/profile/presentation/pages/profile_page.dart';
import '../features/profile/presentation/pages/edit_profile_page.dart';
import '../features/profile/presentation/pages/change_password_page.dart';
import '../features/profile/presentation/pages/address_list_page.dart';
import '../features/profile/presentation/pages/settings_page.dart';
import '../features/home/presentation/pages/main_page.dart';
import '../features/cart/presentation/pages/cart_page.dart';

/// Application router configuration
class AppRouter {
  AppRouter._();

  static final GoRouter router = GoRouter(
    initialLocation: RouteNames.splash,
    debugLogDiagnostics: true,
    routes: [
      // Splash Screen
      GoRoute(
        path: RouteNames.splash,
        name: 'splash',
        builder: (context, state) => BlocProvider(
          create: (_) => sl<AuthBloc>(),
          child: const SplashPage(),
        ),
      ),

      // Auth Routes
      GoRoute(
        path: RouteNames.login,
        name: 'login',
        builder: (context, state) => BlocProvider(
          create: (_) => sl<AuthBloc>(),
          child: const LoginPage(),
        ),
      ),
      GoRoute(
        path: RouteNames.register,
        name: 'register',
        builder: (context, state) => BlocProvider(
          create: (_) => sl<AuthBloc>(),
          child: const RegisterPage(),
        ),
      ),

      // Home with bottom navigation
      GoRoute(
        path: RouteNames.home,
        name: 'home',
        builder: (context, state) => BlocProvider(
          create: (_) => sl<AuthBloc>(),
          child: const MainPage(),
        ),
      ),

      // Profile
      GoRoute(
        path: RouteNames.profile,
        name: 'profile',
        builder: (context, state) => BlocProvider(
          create: (_) => sl<AuthBloc>(),
          child: const ProfilePage(),
        ),
      ),

      // Edit Profile
      GoRoute(
        path: RouteNames.editProfile,
        name: 'editProfile',
        builder: (context, state) => BlocProvider(
          create: (_) => sl<AuthBloc>(),
          child: const EditProfilePage(),
        ),
      ),

      // Change Password
      GoRoute(
        path: RouteNames.changePassword,
        name: 'changePassword',
        builder: (context, state) => const ChangePasswordPage(),
      ),

      // Addresses
      GoRoute(
        path: RouteNames.addresses,
        name: 'addresses',
        builder: (context, state) => const AddressListPage(),
      ),

      // Settings
      GoRoute(
        path: RouteNames.settings,
        name: 'settings',
        builder: (context, state) => BlocProvider(
          create: (_) => sl<AuthBloc>(),
          child: const SettingsPage(),
        ),
      ),

      // Cart
      GoRoute(
        path: RouteNames.cart,
        name: 'cart',
        builder: (context, state) => const CartPage(),
      ),
    ],

    // Error handling
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('Error')),
      body: Center(
        child: Text('Error: ${state.error?.toString() ?? "Unknown error"}'),
      ),
    ),
  );
}
