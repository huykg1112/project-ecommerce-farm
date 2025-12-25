import 'package:equatable/equatable.dart';

/// Auth events
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

/// Login requested event
class LoginRequested extends AuthEvent {
  final String username;
  final String password;

  const LoginRequested({
    required this.username,
    required this.password,
  });

  @override
  List<Object?> get props => [username, password];
}

/// Register requested event
class RegisterRequested extends AuthEvent {
  final String email;
  final String password;
  final String username;
  final String? fullName;
  final String? phoneNumber;

  const RegisterRequested({
    required this.email,
    required this.password,
    required this.username,
    this.fullName,
    this.phoneNumber,
  });

  @override
  List<Object?> get props => [email, password, username, fullName, phoneNumber];
}

/// Logout requested event
class LogoutRequested extends AuthEvent {
  const LogoutRequested();
}

/// Check auth status event
class CheckAuthStatusRequested extends AuthEvent {
  const CheckAuthStatusRequested();
}

/// Get current user event
class GetCurrentUserRequested extends AuthEvent {
  const GetCurrentUserRequested();
}

/// Google login requested event
class GoogleLoginRequested extends AuthEvent {
  final String googleToken;

  const GoogleLoginRequested({required this.googleToken});

  @override
  List<Object?> get props => [googleToken];
}
