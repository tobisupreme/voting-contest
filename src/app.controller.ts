import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/auth.public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Get health
   */
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
