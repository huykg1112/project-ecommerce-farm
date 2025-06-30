import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  create(@Body() createCartItemDto: CreateCartItemDto, @Req() req) {
    createCartItemDto.user = req.user as unknown as User;
    return this.cartItemsService.create(createCartItemDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.cartItemsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.update(id, updateCartItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemsService.remove(id);
  }
}
