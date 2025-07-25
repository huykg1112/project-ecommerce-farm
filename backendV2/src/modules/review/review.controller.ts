import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { Role } from '../../auth/enums/role.enum';
import { CreateReviewResponseDto } from './dto/create-review-response.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // danh cho người dùng tạo review
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
    // If user_id not provided, use current user's ID
    if (!createReviewDto.user_id && !createReviewDto.distributor_id) {
      createReviewDto.user_id = req.user.user_id;
    }
    return this.reviewService.create(createReviewDto);
  }

  // dành cho người dùng phản hồi lại review của người khác
  @Post('response')
  async createResponse(
    @Body() createResponseDto: CreateReviewResponseDto,
    @Request() req: any,
  ) {
    // Convert response DTO to create DTO
    const createReviewDto: CreateReviewDto = {
      product_id: '', // Will be populated from parent review
      distributor_id: createResponseDto.distributor_id || req.user.user_id,
      parent_review_id: createResponseDto.parent_review_id,
      comment: createResponseDto.comment,
    };

    // Get parent review to get product_id
    const parentReview = await this.reviewService.findOne(
      createResponseDto.parent_review_id,
    );
    createReviewDto.product_id = parentReview.product.product_id;

    return this.reviewService.create(createReviewDto);
  }

  //chỉ có admin mới có thể xem tất cả review
  @Get()
  async findAll(@Request() req) {
    const role = req.user.role?.role_name || Role.CLIENT; // Default to USER if no role

    if (role !== Role.ADMIN) {
      throw new Error('Bạn không có quyền thực hiện hành động này'); // Or handle as needed
    }

    return this.reviewService.findAll();
  }

  @Get('my-distributor-reviews')
  async findMyDistributorReviews(@Request() req: any) {
    const userId = req.user.user_id;
    return this.reviewService.findMyDistributorAll(userId);
  }

  @Get('my-client-reviews')
  async findMyClientReviews(@Request() req: any) {
    const userId = req.user.user_id;
    return this.reviewService.findMyClientAll(userId);
  }

  // lấy toàn bộ review của một sản phẩm
  @Public()
  @Get('product/:productId')
  async findAllByProduct(@Param('productId') productId: string) {
    return this.reviewService.findAllByProduct(productId);
  }

  //kiểm tra người dùng đã đánh giá sản phẩm hay chưa
  @Get('check-review')
  async checkReview(@Req() req: any, @Query('product_id') productId: string) {
    const userId = req.user.user_id;

    if (!userId) {
      throw new Error('Vui lòng đăng nhập để kiểm tra đánh giá');
    }
    return this.reviewService.hasReviewedProduct(userId, productId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Delete()
  async remove(@Body() deleteDto: DeleteReviewDto, @Request() req: any) {
    const rule = req.user.role?.role_name || Role.CLIENT; // Default to USER if no role

    if (rule !== Role.ADMIN) {
      throw new Error('Bạn không có quyền thực hiện hành động này'); // Or handle as needed
    }
    return this.reviewService.remove(deleteDto);
  }
}
