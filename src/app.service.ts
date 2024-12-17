import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  queryBuilder(query: any, mongooseQuery: any) {}
}
