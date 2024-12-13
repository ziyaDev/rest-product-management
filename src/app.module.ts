import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from './env';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { MongooseSharedModule } from './schemas/mongoose.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'development'
          ? '.env.development.local'
          : '.env',
      ],
      validate: (config) => envSchema.parse(config),
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (envService: EnvService) => ({
        secret: envService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      imports: [EnvModule],
      inject: [EnvService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (envService: EnvService) => ({
        uri: envService.get('MONGO_DB_URL'),
        dbName: 'rest-pm',
      }),
      imports: [EnvModule],
      inject: [EnvService],
    }),
    UserModule,
    MongooseSharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
