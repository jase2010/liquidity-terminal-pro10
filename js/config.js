const CONFIG = {
    API_KEYS: {
        ALPHA_VANTAGE: 'demo',
        COINGECKO: '',
        NEWSAPI: 'demo',
        POLYGON: 'demo',
    },
    API_ENDPOINTS: {
        ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
        COINGECKO: 'https://api.coingecko.com/api/v3',
        NEWSAPI: 'https://newsapi.org/v2',
        POLYGON: 'https://api.polygon.io',
    },
    DEFAULT_WATCHLIST: ['SPY', 'BTC', 'ETH', 'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'],
    REFRESH_INTERVALS: {
        MARKET_DATA: 60000,
        CRYPTO_DATA: 30000,
        NEWS: 300000,
        PORTFOLIO: 120000,
    },
    STORAGE_KEYS: {
        WATCHLIST: 'lt_watchlist',
        PORTFOLIO: 'lt_portfolio',
        ALERTS: 'lt_alerts',
        PREFERENCES: 'lt_preferences',
        THEME: 'lt_theme',
    },
    SECTORS: [
        'Technology', 'Healthcare', 'Finance', 'Consumer', 'Industrial',
        'Energy', 'Utilities', 'Materials', 'Real Estate', 'Communication',
    ],
};
