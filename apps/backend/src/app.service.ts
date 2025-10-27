import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '廠商安全評估系統 API - 運行中';
  }
}

