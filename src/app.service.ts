import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): {
    status: string;
    timestamp: number;
    uptime: number;
  } {
    return {
      status: 'OK',
      timestamp: Date.now(),
      uptime: process.uptime(),
    };
  }
}
