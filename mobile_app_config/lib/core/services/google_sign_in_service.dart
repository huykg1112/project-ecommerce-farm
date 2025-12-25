import 'package:google_sign_in/google_sign_in.dart';
import 'package:injectable/injectable.dart';

/// Google Sign In Service
/// Handles Google OAuth authentication
@lazySingleton
class GoogleSignInService {
  // Configure Google Sign In
  // Note: Requires Google Cloud Console setup
  // Add your web client ID here
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: [
      'email',
      'profile',
    ],
    // Add your web client ID from Google Cloud Console
    // serverClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  );

  /// Sign in with Google
  /// Returns Google ID token on success, null if cancelled/failed
  Future<String?> signIn() async {
    try {
      // Trigger Google Sign In flow
      final GoogleSignInAccount? account = await _googleSignIn.signIn();

      if (account == null) {
        // User cancelled the sign in
        return null;
      }

      // Get authentication details
      final GoogleSignInAuthentication auth = await account.authentication;

      // Return the ID token
      return auth.idToken;
    } catch (error) {
      print('Error signing in with Google: $error');
      return null;
    }
  }

  /// Sign out from Google
  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
    } catch (error) {
      print('Error signing out from Google: $error');
    }
  }

  /// Disconnect Google account
  Future<void> disconnect() async {
    try {
      await _googleSignIn.disconnect();
    } catch (error) {
      print('Error disconnecting Google: $error');
    }
  }

  /// Check if user is currently signed in
  Future<bool> isSignedIn() async {
    return await _googleSignIn.isSignedIn();
  }

  /// Get current Google account if signed in
  Future<GoogleSignInAccount?> getCurrentAccount() async {
    return _googleSignIn.currentUser;
  }
}
