import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user_id: string, createAddressDto: CreateAddressDto) {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
      is_deleted: false,
      is_active: true,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Nếu đây là địa chỉ mặc định, tắt tất cả địa chỉ mặc định cũ
    if (createAddressDto.is_default) {
      await this.disableAllDefaultAddresses(user_id);
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });

    const savedAddress = await this.addressRepository.save(address);

    return {
      message: 'Địa chỉ đã được tạo thành công',
      data: savedAddress,
    };
  }

  async findAll(user_id: string) {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
      is_deleted: false,
      is_active: true,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const addresses = await this.addressRepository.find({
      where: {
        user: { user_id: user_id },
        is_active: true,
        is_deleted: false,
      },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });

    return {
      message: 'Lấy danh sách địa chỉ thành công',
      data: addresses,
      total: addresses.length,
    };
  }

  async findOne(user_id: string, id: string) {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
      is_deleted: false,
      is_active: true,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const address = await this.addressRepository.findOne({
      where: {
        address_id: id,
        user: { user_id: user_id },
        is_active: true,
        is_deleted: false,
      },
    });

    if (!address) {
      throw new NotFoundException(
        `Address with ID ${id} not found for this user`,
      );
    }

    return {
      message: 'Lấy thông tin địa chỉ thành công',
      data: address,
    };
  }

  async update(
    user_id: string,
    id: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
      is_deleted: false,
      is_active: true,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const address = await this.addressRepository.findOne({
      where: {
        address_id: id,
        user: { user_id: user_id },
        is_active: true,
        is_deleted: false,
      },
    });

    if (!address) {
      throw new NotFoundException(
        `Address with ID ${id} not found for this user`,
      );
    }

    // Nếu đang set địa chỉ này làm mặc định
    if (updateAddressDto.is_default) {
      await this.disableAllDefaultAddresses(user_id, id);
    }

    Object.assign(address, updateAddressDto);
    const updatedAddress = await this.addressRepository.save(address);

    return {
      message: 'Cập nhật địa chỉ thành công',
      data: updatedAddress,
    };
  }

  async remove(user_id: string, id: string) {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
      is_deleted: false,
      is_active: true,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const address = await this.addressRepository.findOne({
      where: {
        address_id: id,
        user: { user_id: user_id },
        is_active: true,
        is_deleted: false,
      },
    });

    if (!address) {
      throw new NotFoundException(
        `Address with ID ${id} not found for this user`,
      );
    }

    const wasDefault = address.is_default;

    // Soft delete
    address.is_active = false;
    address.is_deleted = true;
    await this.addressRepository.save(address);

    // Nếu đây là địa chỉ mặc định, tìm địa chỉ khác làm mặc định
    if (wasDefault) {
      await this.setNewDefaultAddress(user_id);
    }

    return {
      message: 'Xóa địa chỉ thành công',
      data: { address_id: id },
    };
  }

  // Tắt tất cả địa chỉ mặc định của user (trừ địa chỉ excludeId nếu có)
  private async disableAllDefaultAddresses(
    user_id: string,
    excludeId?: string,
  ) {
    const whereCondition: any = {
      user: { user_id: user_id },
      is_default: true,
      is_active: true,
      is_deleted: false,
    };

    if (excludeId) {
      whereCondition.address_id = Not(excludeId);
    }

    await this.addressRepository.update(whereCondition, { is_default: false });
  }

  // Set địa chỉ mới nhất làm mặc định khi xóa địa chỉ mặc định
  private async setNewDefaultAddress(user_id: string) {
    const newDefaultAddress = await this.addressRepository.findOne({
      where: {
        user: { user_id: user_id },
        is_active: true,
        is_deleted: false,
      },
      order: { created_at: 'DESC' },
    });

    if (newDefaultAddress) {
      newDefaultAddress.is_default = true;
      await this.addressRepository.save(newDefaultAddress);
    }
  }

  // Method để set địa chỉ mặc định
  async setDefault(user_id: string, id: string) {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
      is_deleted: false,
      is_active: true,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const address = await this.addressRepository.findOne({
      where: {
        address_id: id,
        user: { user_id: user_id },
        is_active: true,
        is_deleted: false,
      },
    });

    if (!address) {
      throw new NotFoundException(
        `Address with ID ${id} not found for this user`,
      );
    }

    // Tắt tất cả địa chỉ mặc định khác
    await this.disableAllDefaultAddresses(user_id, id);

    // Set địa chỉ này làm mặc định
    address.is_default = true;
    const updatedAddress = await this.addressRepository.save(address);

    return {
      message: 'Đã set địa chỉ mặc định thành công',
      data: updatedAddress,
    };
  }
}
