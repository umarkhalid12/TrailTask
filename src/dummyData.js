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
      { close: 87000 }, // big up
      { close: 65000 }, // big down 1
      { close: 75000 }, // big up
      { close: 86000 }, // big down 2
      { close: 90000 }, // big up
      { close: 77000 }, // big down 3
      { close: 91000 }, // big up
      { close: 88000 }, // big down 4
      { close: 84000 }, // big up
      { close: 89000 }, // big down 5
      { close: 89000.87 },
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

