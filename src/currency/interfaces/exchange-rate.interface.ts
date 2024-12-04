export interface ExchangeRate {
    currencyCodeA: number;  // Source currency code
    currencyCodeB: number;  // Target currency code
    date: number;           // Timestamp of the rate
    rateBuy?: number;       // Rate to buy the currency (optional)
    rateSell?: number;      // Rate to sell the currency (optional)
    rateCross?: number;     // Cross rate between the currencies (optional)
  }