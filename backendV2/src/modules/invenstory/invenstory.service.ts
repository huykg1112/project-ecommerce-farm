import { Injectable } from '@nestjs/common';
import { CreateInvenstoryDto } from './dto/create-invenstory.dto';
import { UpdateInvenstoryDto } from './dto/update-invenstory.dto';

@Injectable()
export class InvenstoryService {
  create(createInvenstoryDto: CreateInvenstoryDto) {
    return 'This action adds a new invenstory';
  }

  findAll() {
    return `This action returns all invenstory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invenstory`;
  }

  update(id: number, updateInvenstoryDto: UpdateInvenstoryDto) {
    return `This action updates a #${id} invenstory`;
  }

  remove(id: number) {
    return `This action removes a #${id} invenstory`;
  }
}
