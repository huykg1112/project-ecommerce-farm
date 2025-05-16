import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { CartItem } from './entities/cart_item.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto) {
    const cartItem = this.cartItemRepository.create(createCartItemDto);
    return await this.cartItemRepository.save(cartItem);
  }

  async findAll(userId: string) {
    return await this.cartItemRepository.find({
      where: { user: { id: userId }, isActive: true },
      relations: ['product'],
    });
  }

  async findOne(id: string) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
    return cartItem;
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.findOne(id);
    Object.assign(cartItem, updateCartItemDto);
    return await this.cartItemRepository.save(cartItem);
  }

  async remove(id: string) {
    const cartItem = await this.findOne(id);
    cartItem.isActive = false;
    return await this.cartItemRepository.save(cartItem);
  }
}
