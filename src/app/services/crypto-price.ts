import { Injectable } from '@angular/core';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  favorite: boolean;
}

@Injectable({ providedIn: 'root' })
export class CryptoPriceService {

  private readonly TOP_CRYPTOS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', short: 'BTC' },
    { symbol: 'ETHUSDT', name: 'Ethereum', short: 'ETH' },
    { symbol: 'SOLUSDT', name: 'Solana', short: 'SOL' },
    { symbol: 'BNBUSDT', name: 'BNB', short: 'BNB' },
    { symbol: 'XRPUSDT', name: 'XRP', short: 'XRP' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', short: 'DOGE' },
    { symbol: 'ADAUSDT', name: 'Cardano', short: 'ADA' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', short: 'AVAX' },
    { symbol: 'DOTUSDT', name: 'Polkadot', short: 'DOT' },
    { symbol: 'MATICUSDT', name: 'Polygon', short: 'MATIC' },
    { symbol: 'LINKUSDT', name: 'Chainlink', short: 'LINK' },
    { symbol: 'UNIUSDT', name: 'Uniswap', short: 'UNI' },
    { symbol: 'ATOMUSDT', name: 'Cosmos', short: 'ATOM' },
    { symbol: 'LTCUSDT', name: 'Litecoin', short: 'LTC' },
    { symbol: 'NEARUSDT', name: 'NEAR Protocol', short: 'NEAR' },
    { symbol: 'FILUSDT', name: 'Filecoin', short: 'FIL' },
    { symbol: 'APTUSDT', name: 'Aptos', short: 'APT' },
    { symbol: 'ARBUSDT', name: 'Arbitrum', short: 'ARB' },
    { symbol: 'OPUSDT', name: 'Optimism', short: 'OP' },
    { symbol: 'INJUSDT', name: 'Injective', short: 'INJ' },
  ];

  async getPrices(): Promise<CryptoPrice[]> {
    try {
      const symbols = this.TOP_CRYPTOS.map(c => `"${c.symbol}"`).join(',');
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols}]`;
      const res = await fetch(url);
      const data = await res.json();

      return data.map((ticker: any) => {
        const crypto = this.TOP_CRYPTOS.find(c => c.symbol === ticker.symbol);
        return {
          symbol: crypto?.short ?? ticker.symbol,
          name: crypto?.name ?? ticker.symbol,
          price: parseFloat(ticker.lastPrice),
          change24h: parseFloat(ticker.priceChangePercent),
          volume24h: parseFloat(ticker.volume) * parseFloat(ticker.lastPrice),
          marketCap: 0,
          favorite: false,
        };
      });
    } catch (e) {
      console.error('Error fetching prices', e);
      return [];
    }
  }
}