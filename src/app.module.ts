import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import { RedisConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        RedisConfig
      ]
    }),
    RedisModule.forRoot({
      type: 'single',
      url: `${process.env.REDIS_URL}`,
    }),
    CurrencyModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
