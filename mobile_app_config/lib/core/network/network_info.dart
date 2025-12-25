import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:injectable/injectable.dart';

/// Abstract class for network connectivity checking
abstract class NetworkInfo {
  /// Check if the device is connected to the internet
  Future<bool> get isConnected;

  /// Stream of connectivity changes
  Stream<List<ConnectivityResult>> get connectivityStream;

  /// Get current connectivity status
  Future<List<ConnectivityResult>> get currentConnectivity;
}

/// Implementation of NetworkInfo using connectivity_plus
@LazySingleton(as: NetworkInfo)
class NetworkInfoImpl implements NetworkInfo {
  final Connectivity _connectivity;

  NetworkInfoImpl(this._connectivity);

  @override
  Future<bool> get isConnected async {
    final results = await _connectivity.checkConnectivity();
    return _isConnectedFromResult(results);
  }

  @override
  Stream<List<ConnectivityResult>> get connectivityStream {
    return _connectivity.onConnectivityChanged;
  }

  @override
  Future<List<ConnectivityResult>> get currentConnectivity async {
    return await _connectivity.checkConnectivity();
  }

  /// Check if any of the connectivity results indicate a connection
  bool _isConnectedFromResult(List<ConnectivityResult> results) {
    if (results.isEmpty) return false;
    return results.any((r) => r != ConnectivityResult.none);
  }
}

/// Extension methods for ConnectivityResult list
extension ConnectivityResultListExtension on List<ConnectivityResult> {
  /// Check if connected to WiFi
  bool get isWifi => any((r) => r == ConnectivityResult.wifi);

  /// Check if connected to mobile data
  bool get isMobile => any((r) => r == ConnectivityResult.mobile);

  /// Check if connected to ethernet
  bool get isEthernet => any((r) => r == ConnectivityResult.ethernet);

  /// Check if connected via bluetooth
  bool get isBluetooth => any((r) => r == ConnectivityResult.bluetooth);

  /// Check if connected via VPN
  bool get isVpn => any((r) => r == ConnectivityResult.vpn);

  /// Check if has any connection
  bool get hasConnection => any((r) => r != ConnectivityResult.none);

  /// Check if no connection
  bool get noConnection => every((r) => r == ConnectivityResult.none);

  /// Get human-readable connection type string
  String get connectionType {
    if (isWifi) return 'WiFi';
    if (isMobile) return 'Mobile Data';
    if (isEthernet) return 'Ethernet';
    if (isBluetooth) return 'Bluetooth';
    if (isVpn) return 'VPN';
    return 'No Connection';
  }

  /// Get connection quality indicator (for UI display)
  /// Returns: excellent, good, fair, poor, none
  String get connectionQuality {
    if (isWifi || isEthernet) return 'excellent';
    if (isMobile) return 'good';
    if (isBluetooth) return 'fair';
    if (isVpn) return 'good';
    return 'none';
  }
}
