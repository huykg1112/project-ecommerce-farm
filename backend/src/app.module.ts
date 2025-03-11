import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CartItemsModule } from './modules/cart_items/cart_items.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FavoriteProductsModule } from './modules/favorite_products/favorite_products.module';
import { InventorysModule } from './modules/inventorys/inventorys.module';
import { OrderItemsModule } from './modules/order_items/order_items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProductBatchesModule } from './modules/product_batches/product_batches.module';
import { ProductImagesModule } from './modules/product_images/product_images.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RolePermissionsModule } from './modules/role_permissions/role_permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'], // Lý do: Hỗ trợ nhiều file .env (dev, prod)
      cache: true, // Lý do: Bật cache để tăng tốc độ truy cập biến môi trường
    }),
    TypeOrmModule.forRootAsync({
      // Lý do: Dùng forRootAsync để đảm bảo ConfigModule tải trước khi cấu hình TypeORM
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNC'), // Lý do: Tắt synchronize ở production
        logging: configService.get<boolean>('DB_LOGGING'), // Lý do: Tùy chọn bật/tắt log
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ProductsModule,
    AuthModule,
    UserModule,
    RolesModule, // Already included
    PermissionsModule, // Already included
    RolePermissionsModule, // Already included
    CategoriesModule,
    ProductImagesModule,
    ProductBatchesModule,
    OrdersModule,
    OrderItemsModule,
    ReviewsModule,
    FavoriteProductsModule,
    CartItemsModule,
    PaymentsModule,
    InventorysModule,
    TokensModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD', // Lý do: Đăng ký JwtAuthGuard làm global guard
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
