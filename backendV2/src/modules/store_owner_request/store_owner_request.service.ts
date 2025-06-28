import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invenstory } from '../invenstory/entities/invenstory.entity';
import { InvenstoryService } from '../invenstory/invenstory.service';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { CreateStoreOwnerRequestDto } from './dto/create-store_owner_request.dto';
import { StoreOwnerRequest } from './entities/store_owner_request.entity';

@Injectable()
export class StoreOwnerRequestService {
  constructor(
    @InjectRepository(StoreOwnerRequest)
    private readonly requestRepo: Repository<StoreOwnerRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Invenstory)
    private readonly invenstoryRepo: Repository<Invenstory>,
    @Inject(InvenstoryService)
    private readonly invenstoryService: InvenstoryService,
  ) {}

  async create(
    userId: string,
    dto: CreateStoreOwnerRequestDto,
  ): Promise<StoreOwnerRequest> {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['role', 'store_owner_request'],
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.role.role_name !== 'user')
      throw new ForbiddenException(
        'Only users can request to become distributor',
      );
    if (user.store_owner_request && !user.store_owner_request.request_status) {
      throw new BadRequestException('You already have a pending request');
    }
    const request = this.requestRepo.create({
      user,
      ...dto,
    });
    return this.requestRepo.save(request);
  }

  async findAll(): Promise<StoreOwnerRequest[]> {
    return this.requestRepo.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<StoreOwnerRequest> {
    const req = await this.requestRepo.findOne({
      where: { store_owner_request_id: id },
      relations: ['user'],
    });
    if (!req) throw new NotFoundException('Request not found');
    return req;
  }

  async update(
    id: string,
    adminId: string,
    approve: boolean,
  ): Promise<{ message: string }> {
    const req = await this.requestRepo.findOne({
      where: { store_owner_request_id: id },
      relations: ['user'],
    });
    if (!req) throw new NotFoundException('Request not found');
    if (req.request_status)
      throw new BadRequestException('Request already approved');
    req.request_status = approve;
    req.approved_date = new Date();
    await this.requestRepo.save(req);
    if (approve) {
      // update user role to distributor
      const role = (await this.userRepo.manager.findOne('Role', {
        where: { role_name: 'distributor' },
      })) as Role;
      if (!role) throw new NotFoundException('Role not found');
      req.user.role = role;
      // tạo invenstory mới từ thông tin đã lưu trong request
      const invenstory = this.invenstoryRepo.create({
        distributor: req.user,
        name: req.name,
        business_license: req.business_license,
        invenstory_address: req.invenstory_address,
        invenstory_lat: req.invenstory_lat,
        invenstory_lng: req.invenstory_lng,
        invenstory_img: req.invenstory_img,
      });
      await this.invenstoryRepo.save(invenstory);
      req.user.inventory = invenstory;
      await this.userRepo.save(req.user);
      return {
        message:
          'Request approved, user is now a distributor and inventory created',
      };
    } else {
      return { message: 'Request rejected' };
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const req = await this.requestRepo.findOne({
      where: { store_owner_request_id: id },
    });
    if (!req) throw new NotFoundException('Request not found');
    await this.requestRepo.remove(req);
    return { message: 'Request deleted' };
  }
}
