import { Controller, Post, Body } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyConvertDTO } from './dtos';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('convert')
  async convertCurrency(@Body() data: CurrencyConvertDTO) {
    const { source, target, amount } = data;

    const convertedAmount = await this.currencyService.convertCurrency(source, target, amount);
    
    return { convertedAmount };
  }
}
