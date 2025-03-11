import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // Lý do: Thêm endpoint health check để kiểm tra trạng thái ứng dụng
  @Get('health')
  healthCheck(): { status: string; timestamp: number } {
    return { status: 'ok', timestamp: Date.now() };
  }
}
