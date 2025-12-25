import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

/// Search products use case
@injectable
class SearchProducts implements UseCase<List<Product>, SearchProductsParams> {
  final ProductRepository _repository;

  SearchProducts(this._repository);

  @override
  Future<Either<Failure, List<Product>>> call(SearchProductsParams params) {
    return _repository.searchProducts(params.query);
  }
}

/// Parameters for search products
class SearchProductsParams {
  final String query;

  const SearchProductsParams({required this.query});
}
