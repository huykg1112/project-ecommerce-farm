import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

class GetProductDetailParams extends Equatable {
  final String productId;

  const GetProductDetailParams({required this.productId});

  @override
  List<Object> get props => [productId];
}

@lazySingleton
class GetProductDetail implements UseCase<Product, GetProductDetailParams> {
  final ProductRepository _repository;

  GetProductDetail(this._repository);

  @override
  Future<Either<Failure, Product>> call(GetProductDetailParams params) async {
    return await _repository.getProductById(params.productId);
  }
}
