/// DTO for updating user profile
class UpdateProfileDto {
  final String? fullName;
  final String? phoneNumber;
  final String? email;
  final String? cccd;
  final String? avatar;
  final String? address;
  final double? lat;
  final double? lng;

  UpdateProfileDto({
    this.fullName,
    this.phoneNumber,
    this.email,
    this.cccd,
    this.avatar,
    this.address,
    this.lat,
    this.lng,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};

    if (fullName != null && fullName!.isNotEmpty) {
      data['full_name'] = fullName;
    }
    if (phoneNumber != null && phoneNumber!.isNotEmpty) {
      data['phone_number'] = phoneNumber;
    }
    if (email != null && email!.isNotEmpty) {
      data['email'] = email;
    }
    if (cccd != null && cccd!.isNotEmpty) {
      data['cccd'] = cccd;
    }
    if (avatar != null && avatar!.isNotEmpty) {
      data['avatar'] = avatar;
    }
    if (address != null && address!.isNotEmpty) {
      data['address'] = address;
    }
    if (lat != null) {
      data['lat'] = lat;
    }
    if (lng != null) {
      data['lng'] = lng;
    }

    return data;
  }
}
