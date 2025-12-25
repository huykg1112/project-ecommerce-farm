import 'package:dartz/dartz.dart';
import '../error/failures.dart';

/// Base UseCase interface
/// Type T is the return type
/// Type Params is the parameters type
abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

/// UseCase without parameters
abstract class NoParamsUseCase<Type> {
  Future<Either<Failure, Type>> call();
}

/// Synchronous UseCase with parameters
abstract class SyncUseCase<Type, Params> {
  Either<Failure, Type> call(Params params);
}

/// Synchronous UseCase without parameters
abstract class NoParamsSyncUseCase<Type> {
  Either<Failure, Type> call();
}

/// Stream-based UseCase
abstract class StreamUseCase<Type, Params> {
  Stream<Either<Failure, Type>> call(Params params);
}

/// Stream-based UseCase without parameters
abstract class NoParamsStreamUseCase<Type> {
  Stream<Either<Failure, Type>> call();
}

/// NoParams class for UseCases that don't require parameters
class NoParams {
  const NoParams();
}
