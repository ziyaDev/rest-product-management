import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
@Global() // Make this module available to all other modules.
@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
