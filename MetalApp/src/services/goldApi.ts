/**
 * GoldAPI Service Layer
 * Stable mock version with 24k price data included.
 */
import { MetalPrice, MetalSymbol, HistoricalDataPoint } from '../types/metals';

interface MockPriceData {
  [key: string]: {
    basePrice: number; // Price per troy ounce
    price_gram_24k: number; // Price per gram
    change: number;
    changePercent: number;
  };
}

// Static mock data with 24k prices added
const MOCK_PRICES: MockPriceData = {
  XAU: { basePrice: 5850.75, price_gram_24k: 188.12, change: 45.20, changePercent: 0.78 },
  XAG: { basePrice: 72.45, price_gram_24k: 2.33, change: -1.15, changePercent: -1.56 },
  XPT: { basePrice: 2650.34, price_gram_24k: 85.22, change: 25.10, changePercent: 0.95 },
  XPD: { basePrice: 3420.89, price_gram_24k: 109.99, change: -18.45, changePercent: -0.54 },
};

class GoldAPIService {
  private priceCache: Map<MetalSymbol, MetalPrice> = new Map();
  private historicalCache: Map<string, HistoricalDataPoint[]> = new Map();

  async getMetalPrice(symbol: MetalSymbol): Promise<MetalPrice> {
    if (this.priceCache.has(symbol)) {
      return this.priceCache.get(symbol)!;
    }

    await new Promise<void>(resolve => setTimeout(resolve, 800));
    
    const mockData = MOCK_PRICES[symbol];
    if (!mockData) {
      throw new Error(`No mock data available for ${symbol}`);
    }

    const price: MetalPrice = {
      metal: symbol,
      currency: 'INR',
      price: mockData.basePrice,
      price_gram_24k: mockData.price_gram_24k, // Added the 24k price
      timestamp: new Date().toISOString(),
      prev_close_price: mockData.basePrice - mockData.change,
      open_price: mockData.basePrice - (mockData.change * 0.5),
      low_price: mockData.basePrice - Math.abs(mockData.change * 1.2),
      high_price: mockData.basePrice + Math.abs(mockData.change * 0.8),
      ch: mockData.change,
      chp: mockData.changePercent,
    };

    this.priceCache.set(symbol, price);
    return price;
  }

  async getHistoricalData(
    symbol: MetalSymbol,
    timeframe: '24h' | 'Week' | 'Month',
    currentPriceData: MetalPrice,
  ): Promise<HistoricalDataPoint[]> {
    const cacheKey = `${symbol}-${timeframe}`;
    if (this.historicalCache.has(cacheKey)) {
      return this.historicalCache.get(cacheKey)!;
    }

    await new Promise<void>(resolve => setTimeout(resolve, 400));
    
    const endPrice = currentPriceData.price;
    const changePercentage = currentPriceData.chp / 100;
    const startPrice = endPrice / (1 + changePercentage);

    let dataPoints = 30;
    let timeInterval = 24 * 60 * 60 * 1000;

    switch (timeframe) {
      case '24h':
        dataPoints = 24;
        timeInterval = 60 * 60 * 1000;
        break;
      case 'Week':
        dataPoints = 7;
        timeInterval = 24 * 60 * 60 * 1000;
        break;
      case 'Month':
        dataPoints = 30;
        timeInterval = 24 * 60 * 60 * 1000;
        break;
    }

    const seed = symbol.charCodeAt(0) + symbol.charCodeAt(1);
    const historicalData = Array.from({ length: dataPoints }, (_, i) => {
      const progress = i / (dataPoints - 1);
      const wave1 = Math.sin(progress * Math.PI * 2 + seed * 0.1) * 0.02;
      const wave2 = Math.sin(progress * Math.PI * 4 + seed * 0.2) * 0.01;
      const trend = progress * changePercentage * 0.01;
      const priceVariation = (wave1 + wave2 + trend) * endPrice;
      const price = startPrice + (endPrice - startPrice) * progress + priceVariation;
      
      return {
        date: new Date(Date.now() - (dataPoints - 1 - i) * timeInterval).toISOString(),
        price: Math.max(price, endPrice * 0.85),
      };
    });

    this.historicalCache.set(cacheKey, historicalData);
    return historicalData;
  }

  clearCache(): void {
    this.priceCache.clear();
    this.historicalCache.clear();
  }
}

export const goldApi = new GoldAPIService();
