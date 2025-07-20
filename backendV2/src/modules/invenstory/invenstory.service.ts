import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateInvenstoryDto } from './dto/create-invenstory.dto';
import { UpdateInvenstoryDto } from './dto/update-invenstory.dto';
import { Invenstory } from './entities/invenstory.entity';

@Injectable()
export class InvenstoryService {
  constructor(
    @InjectRepository(Invenstory)
    private readonly invenstoryRepo: Repository<Invenstory>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createInvenstoryDto: CreateInvenstoryDto) {
    let distributor: User | undefined;
    if (createInvenstoryDto.distributor_id) {
      distributor = (await this.userRepo.findOne({
        where: { user_id: createInvenstoryDto.distributor_id },
      })) as User;
      if (!distributor) throw new NotFoundException('Distributor not found');
    }
    const invenstory = this.invenstoryRepo.create({
      ...createInvenstoryDto,
      distributor,
    });
    return this.invenstoryRepo.save(invenstory);
  }

  async findAll() {
    return this.invenstoryRepo.find({
      relations: [
        'distributor',
        'batch_products.product',
        'batch_products.product.images',
        'batch_products.product.manufacturer',
        'batch_products.product.reviews',
        'batch_products.product.categories',
        'batch_products.product.productDiseases',
        'batch_products.product.productDiseases.disease',
        'batch_products.product.product_ingredients',
        'batch_products.product.product_ingredients.ingredient',
        'batch_products.product_types',
        'batch_products.promotions',
      ],
      where: { is_deleted: false },
    });
  }

  async findForUsers() {
    return this.invenstoryRepo.find({
      where: { is_active: true, is_deleted: false },
      relations: [
        'distributor',
        'batch_products.product',
        'batch_products.product.images',
        'batch_products.product.manufacturer',
        'batch_products.product.reviews',
        'batch_products.product.categories',
        'batch_products.product.productDiseases',
        'batch_products.product.productDiseases.disease',
        'batch_products.product.product_ingredients',
        'batch_products.product.product_ingredients.ingredient',
        'batch_products.product_types',
        'batch_products.promotions',
      ],
    });
  }

  async findOne(id: string) {
    return this.invenstoryRepo.findOne({
      where: { invenstory_id: id, is_deleted: false },
      relations: ['distributor'],
    });
  }

  async update(id: string, updateInvenstoryDto: UpdateInvenstoryDto) {
    const invenstory = await this.invenstoryRepo.findOne({
      where: { invenstory_id: id, is_deleted: false },
    });
    if (!invenstory) throw new Error('Invenstory not found');
    Object.assign(invenstory, updateInvenstoryDto);
    return this.invenstoryRepo.save(invenstory);
  }

  async remove(id: string) {
    const invenstory = await this.invenstoryRepo.findOne({
      where: { invenstory_id: id, is_deleted: false },
    });
    if (!invenstory) throw new Error('Invenstory not found');
    invenstory.is_deleted = true;
    await this.invenstoryRepo.save(invenstory);
    return { message: 'Invenstory deleted' };
  }

  // Hàm tạo invenstory từ store_owner_request nếu cần dùng riêng
  async createFromRequest(user: User, request: any) {
    const invenstory = this.invenstoryRepo.create({
      distributor: user,
      name: request.name,
      business_license: request.business_license,
      invenstory_address: request.invenstory_address,
      invenstory_lat: request.invenstory_lat,
      invenstory_lng: request.invenstory_lng,
      invenstory_img: request.invenstory_img,
    });
    return this.invenstoryRepo.save(invenstory);
  }
  async updateStatus(id: string, status: boolean) {
    const invenstory = await this.invenstoryRepo.findOne({
      where: { invenstory_id: id, is_deleted: false },
    });
    if (!invenstory) throw new NotFoundException('Invenstory not found');
    invenstory.is_active = status;
    return this.invenstoryRepo.save(invenstory);
  }
}
