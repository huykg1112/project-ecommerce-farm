import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { CloudinaryService } from '@root/src/cloudinary/cloudinary.service';

@Injectable()
export class InventorysService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {

    const { nameStore, addressStore, userId, lat, lng, imageStore, imageStorePublicId } = createInventoryDto;

    const newInventory = this.inventoryRepository.create({
      nameStore,
      addressStore,
      userId,
      lat,
      lng,
      imageStore,
      imageStorePublicId,
    });
    return this.inventoryRepository.save(newInventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async findByUserId(userId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    const inventory = await this.findOne(id);

    // Kiểm tra quyền cập nhật
    if (updateInventoryDto.isApproved !== undefined && !this.isAdmin()) {
      throw new BadRequestException('Only admin can approve inventory');
    }

    Object.assign(inventory, updateInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOne(id);
    await this.inventoryRepository.remove(inventory);
  }

  async approve(id: string): Promise<Inventory> {
    const inventory = await this.findOne(id);
    inventory.isApproved = true;
    return this.inventoryRepository.save(inventory);
  }

  async reject(id: string): Promise<Inventory> {
    const inventory = await this.findOne(id);
    inventory.isApproved = false;
    return this.inventoryRepository.save(inventory);
  }

  private isAdmin(): boolean {
    // TODO: Implement admin check logic
    return true;
  }
  async updateImgStore(id: string, imageStore: string, imageStorePublicId: string): Promise<Inventory> {
    if (!imageStore || !imageStorePublicId) {
      throw new BadRequestException('Image store and image store public ID are required');
    }
    const inventory = await this.findOne(id);
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    try {
      // Xóa ảnh cũ nếu có
      if (inventory.imageStorePublicId) {
        await this.cloudinaryService.deleteImage(inventory.imageStorePublicId);
      }

      // Cập nhật thông tin ảnh mới
      inventory.imageStore = imageStore;
      inventory.imageStorePublicId = imageStorePublicId;
      return await this.inventoryRepository.save(inventory);
    } catch (error) {
      console.error('Update avatar error:', error);
      throw new BadRequestException('Failed to update avatar: ' + error.message);
    }

  }

}
