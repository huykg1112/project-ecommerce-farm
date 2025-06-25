import { Injectable } from '@nestjs/common';
import { CreateStoreOwnerRequestDto } from './dto/create-store_owner_request.dto';
import { UpdateStoreOwnerRequestDto } from './dto/update-store_owner_request.dto';

@Injectable()
export class StoreOwnerRequestService {
  create(createStoreOwnerRequestDto: CreateStoreOwnerRequestDto) {
    return 'This action adds a new storeOwnerRequest';
  }

  findAll() {
    return `This action returns all storeOwnerRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeOwnerRequest`;
  }

  update(id: number, updateStoreOwnerRequestDto: UpdateStoreOwnerRequestDto) {
    return `This action updates a #${id} storeOwnerRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeOwnerRequest`;
  }
}
