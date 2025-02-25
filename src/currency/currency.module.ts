import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CurrencyService],
  controllers: [CurrencyController],
  exports: [CurrencyService]
})
export class CurrencyModule {}
