import { Injectable } from "@nestjs/common";
import { Env } from ".";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}
  get<T extends keyof Env>(key: T): Env[T] {
    return this.configService.get<Env[T]>(key);
  }
}
