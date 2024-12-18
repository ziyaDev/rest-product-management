import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/credit-cards')
  getCreditCards() {
    return this.appService.getCreditCards();
  }
  @Get()
  getHello() {
    return 'Hello world!';
  }
}
