# Currency Converter API

This is a Node.js application built with NestJS that serves as a currency converter. The application fetches exchange rates from the Monobank API, performs currency conversion, and implements a caching layer using Redis for better performance.

## Features

- Convert currencies using live exchange rates.
- Fetch exchange rates from the Monobank API.
- Implement caching with Redis to optimize repeated requests.
- Supports direct and cross-currency conversions.

## Technologies Used

- **NestJS**: Backend framework for building the API.
- **TypeScript**: Type-safe programming language.
- **Monobank API**: Provides live exchange rates.
- **Redis**: Caching layer for exchange rates.
- **Axios**: HTTP client for fetching data from the Monobank API.

## API Endpoints

### `POST /currency/convert`

Converts a given amount from the source currency to the target currency.

#### Request Body

```json
{
  "source": "currencyCodeA",
  "target": "currencyCodeB",
  "amount": "amountToConvert"
}
```

### Parameters
- **source**: The currency code of the source currency (e.g., 840 for USD).
- **target**: The currency code of the target currency (e.g., 980 for UAH).
- **amount**: The amount to convert (e.g., 100).

### Example Request
```bash
curl -X POST http://localhost:3000/currency/convert \
  -H "Content-Type: application/json" \
  -d '{"source": 840, "target": 980, "amount": 100}'
```

# Setup and Installation

Follow these steps to get the project up and running locally.

## 1. Install Dependencies
```bash
npm install
```
## 2. Configure Redis

Make sure Redis is installed and running locally.

Alternatively, you can use a Redis Docker container:
```bash
docker run --name redis -p 6379:6379 -d redis
```

## 3. Configure Environment Variables
Copy and fill environment variables
```bash
cp .env.example .env
```
Example
```bash
PORT=3000
REDIS_URL=redis://localhost:6379
CACHE_EXPIRY=3600
MONOBANK_API_URL=https://api.monobank.ua/bank/currency
```
## 4. Run the Application
```bash
npm run start
```

