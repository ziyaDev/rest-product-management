import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Schemas from '.';

@Global() // <-- We make sure it's global so we dont have to import it in every module
@Module({
  imports: [MongooseModule.forFeature(Schemas)],
  exports: [MongooseModule],
})
export class MongooseSharedModule {}
