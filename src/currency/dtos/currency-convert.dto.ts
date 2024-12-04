import { IsNumber } from 'class-validator';

export class CurrencyConvertDTO {
  @IsNumber()
  target: number;
  @IsNumber()
  source: number;
  @IsNumber()
  amount: number;
}