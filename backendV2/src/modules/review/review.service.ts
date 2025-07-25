import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    const {
      product_id,
      user_id,
      distributor_id,
      parent_review_id,
      rating,
      comment,
    } = createReviewDto;

    // Validate product exists
    const product = await this.productRepository.findOne({
      where: { product_id, is_deleted: false },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Validate users exist if provided
    if (user_id) {
      const user = await this.userRepository.findOne({
        where: { user_id, is_deleted: false },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if user already reviewed this product
      const existingReview = await this.reviewRepository.findOne({
        where: {
          product: { product_id },
          user: { user_id },
          is_deleted: false,
          parent_review: IsNull(), // Use IsNull() for TypeORM
        },
      });
      if (existingReview) {
        throw new BadRequestException('User has already reviewed this product');
      }
    }

    if (distributor_id) {
      const distributor = await this.userRepository.findOne({
        where: { user_id: distributor_id, is_deleted: false },
        relations: ['role'],
      });
      if (!distributor || distributor.role.role_name !== 'Distributor') {
        throw new NotFoundException('Distributor not found');
      }
    }

    // Validate parent review if this is a response
    let parentReview: Review | null = null;
    if (parent_review_id) {
      parentReview = await this.reviewRepository.findOne({
        where: { review_id: parent_review_id, is_deleted: false },
      });
      if (!parentReview) {
        throw new NotFoundException('Parent review not found');
      }

      // Check if distributor already responded to this review
      if (distributor_id) {
        const existingResponse = await this.reviewRepository.findOne({
          where: {
            parent_review: { review_id: parent_review_id },
            distributor: { user_id: distributor_id },
            is_deleted: false,
          },
        });
        if (existingResponse) {
          throw new BadRequestException(
            'Distributor has already responded to this review',
          );
        }
      }

      // Response shouldn't have rating
      if (rating) {
        throw new BadRequestException('Responses cannot have ratings');
      }
    } else {
      // Main reviews from users should have rating
      if (user_id && !rating) {
        throw new BadRequestException('User reviews must include a rating');
      }
    }

    const review = this.reviewRepository.create({
      product: { product_id } as Product,
      user: user_id ? ({ user_id } as User) : undefined,
      distributor: distributor_id
        ? ({ user_id: distributor_id } as User)
        : undefined,
      parent_review: parentReview || undefined,
      rating: rating || undefined,
      comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Fetch the complete review with relations
    const completeReview = await this.reviewRepository.findOne({
      where: { review_id: savedReview.review_id },
      relations: [
        'product',
        'user',
        'distributor',
        'parent_review',
        'distributor_response_review',
      ],
    });

    return this.mapToResponseDto(completeReview!);
  }

  async findAll() {
    const reviews = await this.reviewRepository.find({
      where: { is_deleted: false },
      relations: [
        'product',
        'user',
        'distributor',
        'parent_review',
        'distributor_response_review',
      ],
      order: { created_at: 'DESC' },
    });
    return reviews;
  }

  async findMyDistributorAll(userId: string) {
    const reviews = await this.reviewRepository.find({
      where: { is_deleted: false, distributor: { user_id: userId } },
      relations: [
        'product',
        'user',
        'distributor',
        'parent_review',
        'distributor_response_review',
      ],
      order: { created_at: 'DESC' },
    });
    return reviews;
  }

  async findMyClientAll(userId: string) {
    const reviews = await this.reviewRepository.find({
      where: { is_deleted: false, user: { user_id: userId } },
      relations: [
        'product',
        'user',
        'distributor',
        'parent_review',
        'distributor_response_review',
      ],
      order: { created_at: 'DESC' },
    });
    return reviews;
  }

  async findOne(id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: id },
      relations: [
        'product',
        'user',
        'distributor',
        'parent_review',
        'distributor_response_review',
      ],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.mapToResponseDto(review);
  }

  // kiểm tra user đã review sản phẩm chưa
  async hasReviewedProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const review = await this.reviewRepository.findOne({
      where: { user: { user_id: userId }, product: { product_id: productId } },
    });
    return !!review;
  }

  async remove(deleteDto: DeleteReviewDto): Promise<{ message: string }> {
    const { review_id } = deleteDto;

    const review = await this.reviewRepository.findOne({
      where: { review_id },
      relations: ['user', 'distributor'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.is_deleted) {
      throw new BadRequestException('Review is already deleted');
    }

    // Only admin can delete reviews

    // Soft delete
    review.is_deleted = true;
    review.updated_at = new Date();
    await this.reviewRepository.save(review);

    return { message: 'Review deleted successfully' };
  }

  async getReviewStats(productId?: string): Promise<{
    total_reviews: number;
    average_rating: number;
    rating_distribution: { rating: number; count: number }[];
    total_responses: number;
  }> {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .where('review.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('review.parent_review_id IS NULL') // Only count main reviews
      .andWhere('review.rating IS NOT NULL'); // Only reviews with ratings

    if (productId) {
      queryBuilder.andWhere('review.product_id = :productId', { productId });
    }

    const totalReviews = await queryBuilder.getCount();

    const avgResult = await queryBuilder
      .select('AVG(review.rating)', 'avg')
      .getRawOne();

    const ratingDistribution = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('review.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('review.parent_review_id IS NULL')
      .andWhere('review.rating IS NOT NULL')
      .andWhere(
        productId ? 'review.product_id = :productId' : '1=1',
        productId ? { productId } : {},
      )
      .groupBy('review.rating')
      .orderBy('review.rating', 'ASC')
      .getRawMany();

    const totalResponses = await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('review.parent_review_id IS NOT NULL') // Only count responses
      .andWhere(
        productId ? 'review.product_id = :productId' : '1=1',
        productId ? { productId } : {},
      )
      .getCount();

    return {
      total_reviews: totalReviews,
      average_rating: parseFloat(avgResult?.avg || '0'),
      rating_distribution: ratingDistribution.map((item) => ({
        rating: parseInt(item.rating),
        count: parseInt(item.count),
      })),
      total_responses: totalResponses,
    };
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      review_id: review.review_id,
      product_id: review.product?.product_id || '',
      user_id: review.user?.user_id,
      distributor_id: review.distributor?.user_id,
      parent_review_id: review.parent_review?.review_id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      updated_at: review.updated_at,
      is_deleted: review.is_deleted,
      product: review.product
        ? {
            product_id: review.product.product_id,
            product_name: review.product.product_name,
            // product_image will be fetched separately if needed
          }
        : undefined,
      user: review.user
        ? {
            user_id: review.user.user_id,
            fullname: review.user.full_name,
            email: review.user.email,
            avatar: review.user.avatar,
          }
        : undefined,
      distributor: review.distributor
        ? {
            user_id: review.distributor.user_id,
            fullname: review.distributor.full_name,
            // company_name is not in User entity - remove this field
          }
        : undefined,
      parent_review: review.parent_review
        ? this.mapToResponseDto(review.parent_review)
        : undefined,
      distributor_response_review: review.distributor_response_review
        ? this.mapToResponseDto(review.distributor_response_review)
        : undefined,
      has_response: !!review.distributor_response_review,
      response_count: review.distributor_response_review ? 1 : 0,
    };
  }
}
