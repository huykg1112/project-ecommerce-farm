import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/localization/app_localizations.dart';
import 'core/localization/locale_cubit.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_cubit.dart';
import 'features/cart/presentation/bloc/local_cart_bloc.dart';
import 'features/wishlist/presentation/bloc/wishlist_bloc.dart';
import 'injection_container.dart';
import 'routes/app_router.dart';

void main() async {
  // Ensure Flutter binding is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Setup dependency injection
  await configureDependencies();

  // Get SharedPreferences instance
  final prefs = await SharedPreferences.getInstance();

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(MyApp(prefs: prefs));
}

class MyApp extends StatelessWidget {
  final SharedPreferences prefs;

  const MyApp({super.key, required this.prefs});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        // Theme Cubit
        BlocProvider<ThemeCubit>(
          create: (_) => ThemeCubit(prefs),
        ),
        // Locale Cubit
        BlocProvider<LocaleCubit>(
          create: (_) => LocaleCubit(prefs),
        ),
        // Wishlist Bloc (local storage)
        BlocProvider<WishlistBloc>(
          create: (_) => WishlistBloc(prefs),
        ),
        // Local Cart Bloc (local storage like frontend)
        BlocProvider<LocalCartBloc>(
          create: (_) => LocalCartBloc(prefs),
        ),
      ],
      child: BlocBuilder<ThemeCubit, ThemeMode>(
        builder: (context, themeMode) {
          return BlocBuilder<LocaleCubit, Locale>(
            builder: (context, locale) {
              // Update system UI style based on theme
              _updateSystemUI(themeMode);

              return MaterialApp.router(
                title: 'FarmCommerce',
                debugShowCheckedModeBanner: false,

                // Theme
                theme: AppTheme.lightTheme,
                darkTheme: AppTheme.darkTheme,
                themeMode: themeMode,

                // Routing
                routerConfig: AppRouter.router,

                // Localization
                locale: locale,
                supportedLocales: const [
                  Locale('vi'),
                  Locale('en'),
                ],
                localizationsDelegates: const [
                  AppLocalizationsDelegate(),
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],
              );
            },
          );
        },
      ),
    );
  }

  void _updateSystemUI(ThemeMode themeMode) {
    final isDark = themeMode == ThemeMode.dark;
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        systemNavigationBarColor:
            isDark ? const Color(0xFF0F172A) : Colors.white,
        systemNavigationBarIconBrightness:
            isDark ? Brightness.light : Brightness.dark,
      ),
    );
  }
}
