import { NestFactory, NestApplication } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const envService = app.get<EnvService>(EnvService);
  const port = envService.get("PORT");
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port || 3000);
  Logger.log(
    `🚀 Application is running on: http://localhost:${envService.get("PORT")}/${globalPrefix}`,
  );
}
bootstrap();
