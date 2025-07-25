import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';
import { TokenModule } from '../token/token.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => TokenModule),
    forwardRef(() => ProductModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
