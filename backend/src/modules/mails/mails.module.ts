import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailsController } from './mails.controller';
import { MailsService } from './mails.service';

@Module({
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService],
  imports: [ConfigModule],
})
export class MailsModule {}
