// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return { status: 'ok', message: 'BookMyCare backend is running' };
  }
}
