import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/services/google_sign_in_service.dart';
import '../../domain/usecases/check_auth_status.dart';
import '../../domain/usecases/get_current_user.dart';
import '../../domain/usecases/login.dart';
import '../../domain/usecases/login_with_google.dart';
import '../../domain/usecases/logout.dart';
import '../../domain/usecases/register.dart';
import 'auth_event.dart';
import 'auth_state.dart';

/// Auth BLoC
@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final Login _login;
  final Register _register;
  final Logout _logout;
  final GetCurrentUser _getCurrentUser;
  final CheckAuthStatus _checkAuthStatus;
  final LoginWithGoogle _loginWithGoogle;
  final GoogleSignInService _googleSignInService;

  AuthBloc(
    this._login,
    this._register,
    this._logout,
    this._getCurrentUser,
    this._checkAuthStatus,
    this._loginWithGoogle,
    this._googleSignInService,
  ) : super(const AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<CheckAuthStatusRequested>(_onCheckAuthStatusRequested);
    on<GetCurrentUserRequested>(_onGetCurrentUserRequested);
    on<GoogleLoginRequested>(_onGoogleLoginRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _login(LoginParams(
      username: event.username,
      password: event.password,
    ));

    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (data) => emit(Authenticated(user: data.user)),
    );
  }

  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _register(RegisterParams(
      email: event.email,
      password: event.password,
      username: event.username,
      fullName: event.fullName,
      phoneNumber: event.phoneNumber,
    ));

    result.fold(
      (failure) {
        // Check if it's a validation failure with field errors
        if (failure is ValidationFailure && failure.errors != null) {
          emit(AuthError(
            message: failure.message,
            fieldErrors: failure.errors,
          ));
        } else {
          emit(AuthError(message: failure.message));
        }
      },
      (data) => emit(Authenticated(user: data.user)),
    );
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _logout();

    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (_) => emit(const LogoutSuccess()),
    );
  }

  Future<void> _onCheckAuthStatusRequested(
    CheckAuthStatusRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _checkAuthStatus();

    result.fold(
      (failure) => emit(const Unauthenticated()),
      (isLoggedIn) {
        if (isLoggedIn) {
          // Get current user if logged in
          add(const GetCurrentUserRequested());
        } else {
          emit(const Unauthenticated());
        }
      },
    );
  }

  Future<void> _onGetCurrentUserRequested(
    GetCurrentUserRequested event,
    Emitter<AuthState> emit,
  ) async {
    final result = await _getCurrentUser();

    result.fold(
      (failure) => emit(const Unauthenticated()),
      (user) => emit(Authenticated(user: user)),
    );
  }

  Future<void> _onGoogleLoginRequested(
    GoogleLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      // Get Google ID token from Google Sign In Service
      final googleIdToken = await _googleSignInService.signIn();

      if (googleIdToken == null) {
        // User cancelled or sign in failed
        emit(const AuthError(message: 'Google Sign In cancelled'));
        return;
      }

      // Send Google ID token to backend
      final result = await _loginWithGoogle(
        GoogleLoginParams(googleIdToken: googleIdToken),
      );

      result.fold(
        (failure) => emit(AuthError(message: failure.message)),
        (data) => emit(Authenticated(user: data.user)),
      );
    } catch (e) {
      emit(AuthError(message: 'Google Sign In failed: ${e.toString()}'));
    }
  }
}
