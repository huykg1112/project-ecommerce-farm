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

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.promotionService.remove(id, req.user.user_id);
  }
}
