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

  async findByName(name: string): Promise<boolean> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { name, isDeleted: false },
    });
    if (!manufacturer) {
      return false;
    }
    return true;
  }

  async findAllForUsers(): Promise<Manufacturer[]> {
    return await this.manufacturerRepository.find({
      where: { isActive: true, isDeleted: false },
      relations: ['products'],
      order: { name: 'ASC' },
    });
  }

  async create(
    createManufacturerDto: CreateManufacturerDto,
  ): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create(
      createManufacturerDto,
    );
    return await this.manufacturerRepository.save(manufacturer);
  }

  async createWithLogo(
    createManufacturerDto: CreateManufacturerDto,
    logoUrl: string | null,
    publicId: string | null,
  ): Promise<Manufacturer> {
    const manufacturerData = {
      ...createManufacturerDto,
      logo: logoUrl || undefined,
      logoPublicId: publicId || undefined,
    };

    const manufacturer = this.manufacturerRepository.create(manufacturerData);
    return await this.manufacturerRepository.save(manufacturer);
  }

  async findAll(): Promise<Manufacturer[]> {
    return await this.manufacturerRepository.find({
      where: { isDeleted: false },
      relations: ['products'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id, isDeleted: false },
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
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id ${id} not found`);
    }
    manufacturer.isDeleted = true; // Soft delete
    await this.manufacturerRepository.save(manufacturer);
  }

  async softDelete(id: string): Promise<Manufacturer> {
    const manufacturer = await this.findOne(id);
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id ${id} not found`);
    }
    manufacturer.isDeleted = true; // Soft delete
    return await this.manufacturerRepository.save(manufacturer);
  }

  async restore(id: string): Promise<Manufacturer> {
    const manufacturer = await this.findOne(id);
    manufacturer.isDeleted = false; // Restore soft delete
    return await this.manufacturerRepository.save(manufacturer);
  }

  async updateManufacturerLogo(
    id: string,
    logoUrl: string,
    publicId: string,
  ): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id, isDeleted: false },
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

  async updateManufacturerWithLogo(
    id: string,
    updateManufacturerDto: UpdateManufacturerDto,
    logoUrl: string | null,
    publicId: string | null,
  ): Promise<Manufacturer> {
    const manufacturer = await this.findOne(id);

    Object.assign(manufacturer, updateManufacturerDto);
    if (logoUrl && publicId) {
      manufacturer.logo = logoUrl;
      manufacturer.logoPublicId = publicId;
    }

    return await this.manufacturerRepository.save(manufacturer);
  }

  async batchToggleStatus(
    ids: string[],
    isActive: boolean,
  ): Promise<Manufacturer[]> {
    const manufacturers = await this.manufacturerRepository.findByIds(ids);
    const manufacturersNoDelete = manufacturers.filter(
      (manufacturer) => !manufacturer.isDeleted,
    );

    if (manufacturersNoDelete.length === 0) {
      throw new NotFoundException('No manufacturers found for the given IDs');
    }

    manufacturersNoDelete.forEach((manufacturer) => {
      manufacturer.isActive = isActive;
    });

    return await this.manufacturerRepository.save(manufacturersNoDelete);
  }

  async batchDelete(ids: string[]): Promise<void> {
    const manufacturers = await this.manufacturerRepository.findByIds(ids);
    const manufacturersNoDelete = manufacturers.filter(
      (manufacturer) => !manufacturer.isDeleted,
    );
    if (manufacturersNoDelete.length === 0) {
      throw new NotFoundException('No manufacturers found for deletion');
    }
    manufacturersNoDelete.forEach((manufacturer) => {
      manufacturer.isDeleted = true; // Soft delete
    });
    await this.manufacturerRepository.save(manufacturersNoDelete);
  }

  async toggleStatus(id: string): Promise<Manufacturer> {
    const manufacturer = await this.findOne(id);
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id ${id} not found`);
    }
    manufacturer.isActive = !manufacturer.isActive; // Toggle status
    return await this.manufacturerRepository.save(manufacturer);
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
