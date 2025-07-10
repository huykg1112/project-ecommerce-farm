import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ActiveIngredientModule } from './modules/active-ingredient/active-ingredient.module';
import { AddressModule } from './modules/address/address.module';
import { AiConsultationModule } from './modules/ai-consultation/ai-consultation.module';
import { BatchProductModule } from './modules/batch-product/batch-product.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { DiseaseModule } from './modules/disease/disease.module';

import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { InvenstoryModule } from './modules/invenstory/invenstory.module';
import { ManufacturersModule } from './modules/manufacturer/manufacturers.module';
import { OrderDetailModule } from './modules/order-detail/order-detail.module';
import { OrderStatusModule } from './modules/order-status/order-status.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { ProductIngredientModule } from './modules/product-ingredient/product-ingredient.module';
import { ProductTypeModule } from './modules/product-type/product-type.module';
import { ProductModule } from './modules/product/product.module';
import { ProductDiseaseModule } from './modules/product_disease/product_disease.module';
import { ProductImageModule } from './modules/product_image/product_image.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { ReviewModule } from './modules/review/review.module';
import { RoleModule } from './modules/role/role.module';
import { StoreOwnerRequestModule } from './modules/store_owner_request/store_owner_request.module';
import { TokenModule } from './modules/token/token.module';
import { TreatmentPlanModule } from './modules/treatment-plan/treatment-plan.module';
import { UserModule } from './modules/user/user.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'your_username'),
        password: configService.get<string>('DB_PASSWORD', 'your_password'),
        database: configService.get<string>('DB_NAME', 'FarmV2'),
        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        migrations: ['src/migrations/*.ts'],
        synchronize: false,
        logging: true,
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    RoleModule,
    UserModule,
    AddressModule,
    CategoryModule,
    ProductTypeModule,
    DiseaseModule,
    ActiveIngredientModule,
    ManufacturersModule,
    CloudinaryModule,
    ProductTypeModule,
    ProductModule,
    ProductIngredientModule,
    BatchProductModule,
    OrderStatusModule,
    PaymentMethodModule,
    OrderModule,
    OrderDetailModule,
    PromotionModule,
    VoucherModule,
    ReviewModule,
    WishlistModule,
    AiConsultationModule,
    TreatmentPlanModule,
    CartModule,
    CartItemModule,
    TokenModule,
    InvenstoryModule,
    ProductImageModule,
    StoreOwnerRequestModule,
    AuthModule,
    ProductDiseaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
