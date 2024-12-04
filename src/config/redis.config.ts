import { registerAs } from '@nestjs/config';

export interface IRedisConfig {
  redisUrl: string;
  cacheExpiry: string;
}

const configData: IRedisConfig = {
  redisUrl: process.env.REDIS_URL,
  cacheExpiry: process.env.CACHE_EXPIRY
};

export const RedisConfig = registerAs<IRedisConfig>('redis', (): IRedisConfig => configData);
