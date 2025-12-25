import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

/// Get products by category use case
@injectable
class GetProductsByCategory
    implements UseCase<List<Product>, GetProductsByCategoryParams> {
  final ProductRepository _repository;

  GetProductsByCategory(this._repository);

  @override
  Future<Either<Failure, List<Product>>> call(
      GetProductsByCategoryParams params) {
    return _repository.getProductsByCategory(params.categoryId);
  }
}

/// Parameters for get products by category
class GetProductsByCategoryParams {
  final String categoryId;

  const GetProductsByCategoryParams({required this.categoryId});
}
