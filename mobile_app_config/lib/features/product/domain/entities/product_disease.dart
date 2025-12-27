import 'package:equatable/equatable.dart';

/// Disease entity
class Disease extends Equatable {
  final String diseaseId;
  final String diseaseName;
  final String? description;

  const Disease({
    required this.diseaseId,
    required this.diseaseName,
    this.description,
  });

  @override
  List<Object?> get props => [diseaseId, diseaseName, description];
}

/// Product-Disease relationship entity
class ProductDisease extends Equatable {
  final String productDiseaseId;
  final Disease disease;
  final bool isPrimary; // Đánh dấu bệnh đặc trị chính

  const ProductDisease({
    required this.productDiseaseId,
    required this.disease,
    this.isPrimary = false,
  });

  @override
  List<Object?> get props => [productDiseaseId, disease, isPrimary];
}
