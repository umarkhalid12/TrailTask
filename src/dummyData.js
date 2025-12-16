// Dummy data for the trading screen

export const tradingData = {
  pair: {
    symbol: 'BTC',
    quote: 'USDT',
    fullName: 'BTC / USDT',
  },
  price: {
    current: 90467.87,
    change: 6.58,
    isPositive: true,
  },
  chart: {
    data: [
      { close: 85000 },
      { close: 86000 },
      { close: 87000 },
      { close: 88000 },
      { close: 89000 },
      { close: 89500 },
      { close: 90000 },
      { close: 90467.87 },
    ],
  },
  timeframes: ['1m', '15m', '1h', '1d', '1w', '1M'],
  selectedTimeframe: '15m',
  orderType: 'Market',
  leverage: 100,
  availableBalance: 2965.65,
  amount: '',
  currency: 'BTC',
  positions: [
    {
      id: 1,
      pair: 'BTCUSDT',
      type: 'Long',
      leverage: 100,
      unrealizedPNL: 127.32,
      unrealizedPNLPercent: 398.23,
      size: 0.034,
      sizeUSD: 3195.34,
      margin: 34.23,
      marginType: 'Cross',
      entryPrice: 90721.92,
      liquidationPrice: 80721.92,
    },
  ],
  openOrders: [],
};

