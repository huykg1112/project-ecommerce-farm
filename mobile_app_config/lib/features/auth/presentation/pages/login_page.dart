import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

import '../../../../core/theme/app_colors.dart';
import '../widgets/login_form.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Gap(40),

              // Logo
              Center(
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.park,
                    size: 60,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const Gap(24),

              // Welcome Text
              const Text(
                'Welcome Back! 👋',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.foreground,
                ),
                textAlign: TextAlign.center,
              ),
              const Gap(8),
              const Text(
                'Sign in to your account',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.mutedForeground,
                ),
                textAlign: TextAlign.center,
              ),
              const Gap(32),

              // Form
              const LoginForm(),
              const Gap(24),

              // Divider
              Row(
                children: [
                  Expanded(child: Divider(color: Colors.grey[300])),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'OR',
                      style: TextStyle(
                        color: Colors.grey[500],
                        fontSize: 14,
                      ),
                    ),
                  ),
                  Expanded(child: Divider(color: Colors.grey[300])),
                ],
              ),
              const Gap(24),

              // Google Login Button
              OutlinedButton.icon(
                onPressed: () {
                  // Trigger Google Login
                  // context.read<AuthBloc>().add(const GoogleLoginRequested(''));
                  // For now, it's a placeholder as we need proper Google Sign In setup
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Google Login coming soon!')),
                  );
                },
                icon: const Icon(Icons.g_mobiledata,
                    size: 28), // Placeholder icon
                // For real app, use SvgPicture.asset('assets/icons/google.svg')
                label: const Text('Continue with Google'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: BorderSide(color: Colors.grey[300]!),
                  foregroundColor: Colors.black87,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
