import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('hello')
  hello() {
    return 'Hello World!';
  }

  @Get('ping')
  signin() {
    return 'Pong!';
  }
}
