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
    const user = await this.userRepository.findOneBy({ user_id: user_id });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    //kiểm tra đây có phải là địa chỉ mật định không, nếu phỉa thì tìm địa chỉ mật định cũ tắt đi và lấy địa chỉ này làm địa chỉ mật định
    if (createAddressDto.is_default) {
      const defaultAddress = await this.addressRepository.findOne({
        where: { user: { user_id: user_id }, is_default: true },
      });
      if (defaultAddress) {
        defaultAddress.is_default = false;
        await this.addressRepository.save(defaultAddress);
      }
    }
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });
    return this.addressRepository.save(address);
  }

  async findAll(user_id: string) {
    return this.addressRepository.find({
      where: { user: { user_id: user_id } },
    });
  }

  async findOne(user_id: string, id: string) {
    const address = await this.addressRepository.findOne({
      where: { address_id: id, user: { user_id: user_id } },
    });
    if (!address) {
      throw new NotFoundException(
        `Address with ID ${id} not found for this user`,
      );
    }
    return address;
  }

  async update(
    user_id: string,
    id: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.findOne(user_id, id);
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(user_id: string, id: string) {
    const address = await this.findOne(user_id, id);

    //kiểm tra đây có phải là địa chỉ mật định không, nếu phải thì lấy địa chỉ mới nhất ko phải cái này làm địa chỉ mật định
    if (address.is_default) {
      //lấy địa chỉ mới nhất ko phải địa chỉ hiện tại làm địa chỉ, mật định
      const newDefaultAddress = await this.addressRepository.findOne({
        where: { user: { user_id: user_id }, address_id: Not(id) },
        order: { created_at: 'DESC' },
      });
      if (newDefaultAddress) {
        newDefaultAddress.is_default = true;
        await this.addressRepository.save(newDefaultAddress);
      }
    }
    await this.addressRepository.remove(address);
    return { message: 'Address removed successfully' };
  }
}
