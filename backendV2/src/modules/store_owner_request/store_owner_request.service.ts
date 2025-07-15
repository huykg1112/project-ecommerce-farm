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
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    if (user.role.role_name !== 'Client')
      throw new ForbiddenException(
        'Chỉ người dùng mới có thể yêu cầu trở thành đại lý',
      );
    if (user.store_owner_request && !user.store_owner_request.request_status) {
      throw new BadRequestException('Bạn đã có yêu cầu chờ phê duyệt');
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
      where: { store_owner_request_id: id, is_deleted: false },
      relations: ['user'],
    });
    if (!req) throw new NotFoundException('Request not found');
    return req;
  }

  async getMyRequest(userId: string): Promise<StoreOwnerRequest> {
    const req = await this.requestRepo.findOne({
      where: { user: { user_id: userId }, is_deleted: false },
      relations: ['user'],
    });
    if (!req) throw new NotFoundException('Không tìm thấy yêu cầu');
    return req;
  }

  async update(
    request_id: string,
    approve: boolean,
  ): Promise<{ message: string }> {
    const req = await this.requestRepo.findOne({
      where: { store_owner_request_id: request_id, is_deleted: false },
      relations: ['user'],
    });
    if (!req) throw new NotFoundException('Không tìm thấy yêu cầu');
    if (req.request_status)
      throw new BadRequestException('Yêu cầu đã được phê duyệt');
    req.request_status = approve;
    req.approved_date = new Date();
    await this.requestRepo.save(req);
    if (approve) {
      // update user role to distributor
      const role = (await this.userRepo.manager.findOne('Role', {
        where: { role_name: 'Distributor' },
      })) as Role;
      if (!role) throw new NotFoundException('Vai trò không tồn tại');
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
      req.user.invenstory = invenstory;
      await this.userRepo.save(req.user);
      return {
        message:
          'Yêu cầu đã được phê duyệt, người dùng đã trở thành đại lý và kho hàng đã được tạo',
      };
    } else {
      return { message: 'Yêu cầu đã bị từ chối' };
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const req = await this.requestRepo.findOne({
      where: { store_owner_request_id: id, is_deleted: false },
    });
    if (!req) throw new NotFoundException('Không tìm thấy yêu cầu');
    req.is_deleted = true; // Đánh dấu là đã xóa
    await this.requestRepo.save(req);
    return { message: 'Yêu cầu đã bị xóa' };
  }
}
