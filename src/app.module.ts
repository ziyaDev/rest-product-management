import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { Env, envSchema } from "./env";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { EnvService } from "./env/env.service";
import { UserModule } from "./user/user.module";
import { EnvModule } from "./env/env.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === "development"
          ? ".env.development.local"
          : ".env",
      ],
      validate: (config) => envSchema.parse(config),
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: async (envService: EnvService) => ({
        secret: envService.get("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
      imports: [EnvModule],
      inject: [EnvService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (envService: EnvService) => ({
        uri: envService.get("MONGO_DB_URL"),
      }),
      imports: [EnvModule],
      inject: [EnvService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
