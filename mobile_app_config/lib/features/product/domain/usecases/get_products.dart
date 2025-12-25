import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

@lazySingleton
class GetProducts implements NoParamsUseCase<List<Product>> {
  final ProductRepository _repository;

  GetProducts(this._repository);

  @override
  Future<Either<Failure, List<Product>>> call() async {
    return await _repository.getProducts();
  }
}
