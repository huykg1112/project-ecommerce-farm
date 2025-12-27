import 'package:equatable/equatable.dart';

/// Shipping address entity for checkout
class ShippingAddress extends Equatable {
  final String fullName;
  final String phoneNumber;
  final String? email;
  final String addressDetail;
  final double latitude;
  final double longitude;

  const ShippingAddress({
    required this.fullName,
    required this.phoneNumber,
    this.email,
    required this.addressDetail,
    this.latitude = 0,
    this.longitude = 0,
  });

  bool get isValid =>
      fullName.isNotEmpty && phoneNumber.isNotEmpty && addressDetail.isNotEmpty;

  ShippingAddress copyWith({
    String? fullName,
    String? phoneNumber,
    String? email,
    String? addressDetail,
    double? latitude,
    double? longitude,
  }) {
    return ShippingAddress(
      fullName: fullName ?? this.fullName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      email: email ?? this.email,
      addressDetail: addressDetail ?? this.addressDetail,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
    );
  }

  Map<String, dynamic> toJson() => {
        'full_name': fullName,
        'phone_number': phoneNumber,
        'email': email,
        'address_detail': addressDetail,
        'latitude': latitude,
        'longitude': longitude,
      };

  @override
  List<Object?> get props =>
      [fullName, phoneNumber, email, addressDetail, latitude, longitude];
}
