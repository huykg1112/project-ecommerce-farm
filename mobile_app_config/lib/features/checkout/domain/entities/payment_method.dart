import 'package:equatable/equatable.dart';

/// Payment method entity
class PaymentMethod extends Equatable {
  final String paymentMethodId;
  final String methodName;
  final String? description;
  final bool isActive;

  const PaymentMethod({
    required this.paymentMethodId,
    required this.methodName,
    this.description,
    this.isActive = true,
  });

  bool get isCOD => methodName.toUpperCase() == 'COD';
  bool get isVNPay => methodName.toUpperCase().contains('VNPAY');

  @override
  List<Object?> get props => [paymentMethodId, methodName, description, isActive];
}
