import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionService } from './promotion.service';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto, @Req() req) {
    return this.promotionService.create(createPromotionDto, req.user.user_id);
  }

  @Post('nobatch')
  createNoBatch(@Body() createPromotionDto: CreatePromotionDto, @Req() req) {
    return this.promotionService.createNoBacthProduct(
      createPromotionDto,
      req.user.user_id,
    );
  }

  @Get('distributor')
  findAllByDistributor(@Req() req) {
    return this.promotionService.findAllByDistributor(req.user.user_id);
  }

  @Public()
  @Get()
  findAll() {
    return this.promotionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @Req() req,
  ) {
    return this.promotionService.update(
      id,
      updatePromotionDto,
      req.user.user_id,
    );
  }
  @Patch(':id/nobatch')
  updateNoBatch(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @Req() req,
  ) {
    return this.promotionService.updateNoBatchProduct(
      id,
      updatePromotionDto,
      req.user.user_id,
    );
  }

  //thêm sản phẩm vào chương trình khuyến mãi
  @Post(':id/batch-product')
  addBatchProduct(
    @Param('id') id: string,
    @Body('batch_product_ids') batch_product_ids: string[],
    @Req() req,
  ) {
    return this.promotionService.addBatchProductsToPromotion(
      id,
      batch_product_ids,
      req.user.user_id,
    );
  }

  // bật/tắt chương trình khuyến mãi
  @Patch(':id/toggle')
  togglePromotion(@Param('id') id: string, @Req() req) {
    return this.promotionService.togglePromotionStatus(id, req.user.user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.promotionService.remove(id, req.user.user_id);
  }
}
