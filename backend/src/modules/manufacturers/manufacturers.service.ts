import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { Manufacturer } from './entities/manufacturer.entity';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createManufacturerDto: CreateManufacturerDto,
  ): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create(
      createManufacturerDto,
    );
    return await this.manufacturerRepository.save(manufacturer);
  }

  async findAll(): Promise<Manufacturer[]> {
    return await this.manufacturerRepository.find({
      relations: ['products'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id ${id} not found`);
    }
    return manufacturer;
  }

  async update(
    id: string,
    updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<Manufacturer> {
    const manufacturer = await this.findOne(id);

    Object.assign(manufacturer, updateManufacturerDto);
    return await this.manufacturerRepository.save(manufacturer);
  }

  async remove(id: string): Promise<void> {
    const manufacturer = await this.findOne(id);
    await this.manufacturerRepository.remove(manufacturer);
  }

  async softDelete(id: string): Promise<Manufacturer> {
    const manufacturer = await this.findOne(id);
    manufacturer.isActive = false;
    return await this.manufacturerRepository.save(manufacturer);
  }

  async restore(id: string): Promise<Manufacturer> {
    const manufacturer = await this.findOne(id);
    manufacturer.isActive = true;
    return await this.manufacturerRepository.save(manufacturer);
  }

  async updateManufacturerLogo(
    id: string,
    logoUrl: string,
    publicId: string,
  ): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Delete old logo if exists
    if (manufacturer.logoPublicId) {
      await this.cloudinaryService.deleteImage(manufacturer.logoPublicId);
    }

    // Update manufacturer with new logo
    manufacturer.logo = logoUrl;
    manufacturer.logoPublicId = publicId;
    return await this.manufacturerRepository.save(manufacturer);
  }

  async findActiveManufacturers(): Promise<Manufacturer[]> {
    return await this.manufacturerRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getManufacturerWithProductCount(id: string): Promise<any> {
    const manufacturer = await this.manufacturerRepository
      .createQueryBuilder('manufacturer')
      .leftJoinAndSelect('manufacturer.products', 'product')
      .where('manufacturer.id = :id', { id })
      .getOne();

    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id ${id} not found`);
    }

    return {
      ...manufacturer,
      productCount: manufacturer.products?.length || 0,
    };
  }
}
