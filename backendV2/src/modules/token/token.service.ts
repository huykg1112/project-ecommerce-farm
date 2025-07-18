import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  // Tìm tất cả token của user
  async findAllByUserId(user_id: string): Promise<Token[]> {
    return this.tokenRepository.find({ where: { user: { user_id: user_id } } });
  }

  // Tìm token cụ thể bằng accessToken
  async findByAccessToken(access_token: string): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { access_token: access_token },
      relations: ['user'],
    });
  }

  // Lưu token
  async save(token: Token): Promise<Token> {
    return this.tokenRepository.save(token);
  }

  // Xóa token cụ thể bằng accessToken
  async deleteByAccessToken(access_token: string): Promise<void> {
    const token = await this.findByAccessToken(access_token);
    if (token) {
      await this.tokenRepository.delete(token.id);
    }
  }

  // Xóa tất cả token của user trừ token hiện tại
  async deleteAllExceptCurrent(
    user_id: string,
    current_access_token: string,
  ): Promise<void> {
    const result = await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where(
        '"user_id" = :user_id AND "access_token" != :current_access_token',
        {
          user_id,
          current_access_token,
        },
      )
      .execute(); // Thực thi truy vấn
    if (result.affected === 0) {
      console.log(result.affected);
      console.warn(`No tokens deleted for user ${user_id}`);
    }
  }

  async createForUser(
    user_id: string,
    access_token: string,
    refresh_token: string,
  ): Promise<Token> {
    const token = this.tokenRepository.create({
      access_token,
      access_token_expires_at: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 giờ
      refresh_token,
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      user: { user_id: user_id },
    });
    return this.tokenRepository.save(token);
  }
  // Xóa token hết hạn
  async cleanExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where(
        '"access_token_expires_at" < :now OR "refresh_token_expires_at" < :now',
        { now },
      )
      .execute();
  }
}
