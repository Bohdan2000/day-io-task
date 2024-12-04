import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ExchangeRate } from './interfaces';

@Injectable()
export class CurrencyService {
    private readonly CACHE_EXPIRY = process.env.CACHE_EXPIRY || 3600; // Cache expiry in seconds
    private readonly REDIS_KEY = 'exchange_rates';
    private readonly MONOBANK_API = process.env.MONOBANK_API_URL;

    constructor(
        @InjectRedis() private readonly redis: Redis,
        private readonly httpService: HttpService,
    ) {}

    private async getCachedRates(): Promise<ExchangeRate[]> {
        const cachedRates = await this.redis.get(this.REDIS_KEY);
        return cachedRates ? JSON.parse(cachedRates) : null;
    }

    private async fetchFromApi(): Promise<ExchangeRate[]> {
        const { data } = await firstValueFrom(
            this.httpService.get<ExchangeRate[]>(this.MONOBANK_API)
        );
        await this.redis.set(
            this.REDIS_KEY,
            JSON.stringify(data),
            'EX',
            this.CACHE_EXPIRY,
        );
        return data;
    }

    private async getExchangeRates(): Promise<ExchangeRate[]> {
        const cachedRates = await this.getCachedRates();
        if (cachedRates) {
            return cachedRates;
        }
        return this.fetchFromApi();
    }

    private findRate(rates: ExchangeRate[], source: number, target: number): ExchangeRate | undefined {
        return rates.find(rate => rate.currencyCodeA === source && rate.currencyCodeB === target);
    }

    private calculateCrossRate(sourceRate: ExchangeRate, targetRate: ExchangeRate, amount: number): number {
        const sourceCrossToUAH = sourceRate.rateCross || (sourceRate.rateBuy + sourceRate.rateSell) / 2;
        const targetCrossToUAH = targetRate.rateCross || (targetRate.rateBuy + targetRate.rateSell) / 2;
        return (sourceCrossToUAH / targetCrossToUAH) * amount;
    }

    async fetchExchangeRates(): Promise<ExchangeRate[]> {
        try {
            return this.getExchangeRates();
        } catch (error) {
            throw new HttpException('Failed to fetch exchange rates', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async convertCurrency(source: number, target: number, amount: number): Promise<number> {
        if (source === target) {
            return amount;
        }

        const rates = await this.fetchExchangeRates();

        let rate = this.findRate(rates, source, target);
        if (rate) {
            return amount * rate.rateBuy;
        }

        if (source === 980) {
            const targetRate = this.findRate(rates, target, 980);
            if (targetRate) {
                return targetRate.rateCross ? amount / targetRate.rateCross : amount / targetRate.rateSell;
            }
        }

        const sourceRate = this.findRate(rates, source, 980);
        const targetRate = this.findRate(rates, target, 980);

        if (!sourceRate || !targetRate) {
            throw new HttpException('Invalid currency codes', HttpStatus.BAD_REQUEST);
        }

        return this.calculateCrossRate(sourceRate, targetRate, amount);
    }
}
