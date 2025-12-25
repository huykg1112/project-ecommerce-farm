// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:connectivity_plus/connectivity_plus.dart' as _i895;
import 'package:dio/dio.dart' as _i361;
import 'package:flutter_secure_storage/flutter_secure_storage.dart' as _i558;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:mobile_app_config/core/network/dio_client.dart' as _i277;
import 'package:mobile_app_config/core/network/network_info.dart' as _i99;
import 'package:mobile_app_config/core/services/google_sign_in_service.dart'
    as _i83;
import 'package:mobile_app_config/features/auth/data/datasources/auth_local_datasource.dart'
    as _i982;
import 'package:mobile_app_config/features/auth/data/datasources/auth_local_datasource_impl.dart'
    as _i239;
import 'package:mobile_app_config/features/auth/data/datasources/auth_remote_datasource.dart'
    as _i963;
import 'package:mobile_app_config/features/auth/data/datasources/auth_remote_datasource_impl.dart'
    as _i785;
import 'package:mobile_app_config/features/auth/data/repositories/auth_repository_impl.dart'
    as _i92;
import 'package:mobile_app_config/features/auth/domain/repositories/auth_repository.dart'
    as _i858;
import 'package:mobile_app_config/features/auth/domain/usecases/check_auth_status.dart'
    as _i45;
import 'package:mobile_app_config/features/auth/domain/usecases/get_current_user.dart'
    as _i432;
import 'package:mobile_app_config/features/auth/domain/usecases/login.dart'
    as _i375;
import 'package:mobile_app_config/features/auth/domain/usecases/login_with_google.dart'
    as _i959;
import 'package:mobile_app_config/features/auth/domain/usecases/logout.dart'
    as _i462;
import 'package:mobile_app_config/features/auth/domain/usecases/register.dart'
    as _i646;
import 'package:mobile_app_config/features/auth/presentation/bloc/auth_bloc.dart'
    as _i404;
import 'package:mobile_app_config/features/product/data/datasources/product_remote_datasource.dart'
    as _i204;
import 'package:mobile_app_config/features/product/data/repositories/product_repository_impl.dart'
    as _i660;
import 'package:mobile_app_config/features/product/domain/repositories/product_repository.dart'
    as _i331;
import 'package:mobile_app_config/features/product/domain/usecases/get_product_detail.dart'
    as _i912;
import 'package:mobile_app_config/features/product/domain/usecases/get_products.dart'
    as _i518;
import 'package:mobile_app_config/features/product/presentation/bloc/product_bloc.dart'
    as _i228;
import 'package:mobile_app_config/injection_container.dart' as _i376;

extension GetItInjectableX on _i174.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    final registerModule = _$RegisterModule();
    gh.lazySingleton<_i277.DioClient>(() => _i277.DioClient());
    gh.lazySingleton<_i83.GoogleSignInService>(
        () => _i83.GoogleSignInService());
    gh.lazySingleton<_i361.Dio>(() => registerModule.dio);
    gh.lazySingleton<_i895.Connectivity>(() => registerModule.connectivity);
    gh.lazySingleton<_i558.FlutterSecureStorage>(
        () => registerModule.secureStorage);
    gh.lazySingleton<_i204.ProductRemoteDataSource>(
        () => _i204.ProductRemoteDataSourceImpl(gh<_i277.DioClient>()));
    gh.lazySingleton<_i982.AuthLocalDataSource>(
        () => _i239.AuthLocalDataSourceImpl(gh<_i558.FlutterSecureStorage>()));
    gh.lazySingleton<_i331.ProductRepository>(
        () => _i660.ProductRepositoryImpl(gh<_i204.ProductRemoteDataSource>()));
    gh.lazySingleton<_i963.AuthRemoteDataSource>(
        () => _i785.AuthRemoteDataSourceImpl(gh<_i277.DioClient>()));
    gh.lazySingleton<_i99.NetworkInfo>(
        () => _i99.NetworkInfoImpl(gh<_i895.Connectivity>()));
    gh.lazySingleton<_i858.AuthRepository>(() => _i92.AuthRepositoryImpl(
          gh<_i963.AuthRemoteDataSource>(),
          gh<_i982.AuthLocalDataSource>(),
          gh<_i99.NetworkInfo>(),
        ));
    gh.lazySingleton<_i518.GetProducts>(
        () => _i518.GetProducts(gh<_i331.ProductRepository>()));
    gh.lazySingleton<_i912.GetProductDetail>(
        () => _i912.GetProductDetail(gh<_i331.ProductRepository>()));
    gh.lazySingleton<_i45.CheckAuthStatus>(
        () => _i45.CheckAuthStatus(gh<_i858.AuthRepository>()));
    gh.lazySingleton<_i432.GetCurrentUser>(
        () => _i432.GetCurrentUser(gh<_i858.AuthRepository>()));
    gh.lazySingleton<_i375.Login>(
        () => _i375.Login(gh<_i858.AuthRepository>()));
    gh.lazySingleton<_i959.LoginWithGoogle>(
        () => _i959.LoginWithGoogle(gh<_i858.AuthRepository>()));
    gh.lazySingleton<_i462.Logout>(
        () => _i462.Logout(gh<_i858.AuthRepository>()));
    gh.lazySingleton<_i646.Register>(
        () => _i646.Register(gh<_i858.AuthRepository>()));
    gh.factory<_i228.ProductBloc>(() => _i228.ProductBloc(
          gh<_i518.GetProducts>(),
          gh<_i912.GetProductDetail>(),
        ));
    gh.factory<_i404.AuthBloc>(() => _i404.AuthBloc(
          gh<_i375.Login>(),
          gh<_i646.Register>(),
          gh<_i462.Logout>(),
          gh<_i432.GetCurrentUser>(),
          gh<_i45.CheckAuthStatus>(),
          gh<_i959.LoginWithGoogle>(),
          gh<_i83.GoogleSignInService>(),
        ));
    return this;
  }
}

class _$RegisterModule extends _i376.RegisterModule {}
