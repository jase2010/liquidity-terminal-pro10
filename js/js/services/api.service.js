class APIService {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000;
    }

    getCached(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < this.cacheExpiry) {
            return item.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCached(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    async getStockQuote(symbol) {
        const cacheKey = `stock_${symbol}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(this.config.API_ENDPOINTS.ALPHA_VANTAGE, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: this.config.API_KEYS.ALPHA_VANTAGE,
                },
            });

            if (response.data['Global Quote'] && Object.keys(response.data['Global Quote']).length > 0) {
                const quote = response.data['Global Quote'];
                const data = {
                    symbol: symbol,
                    price: parseFloat(quote['05. price']),
                    change: parseFloat(quote['09. change']),
                    changePercent: parseFloat(quote['10. change percent']),
                    volume: parseInt(quote['06. volume']),
                    timestamp: new Date(),
                };
                this.setCached(cacheKey, data);
                return data;
            }
        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
        }

        return this.generateMockStockData(symbol);
    }

    async getCryptoPrices() {
        const cacheKey = 'crypto_prices';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.config.API_ENDPOINTS.COINGECKO}/simple/price`, {
                params: {
                    ids: 'bitcoin,ethereum,cardano,solana,polkadot,ripple,litecoin,dogecoin',
                    vs_currencies: 'usd',
                    include_market_cap: true,
                    include_24hr_vol: true,
                    include_24hr_change: true,
                },
            });

            this.setCached(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            return this.generateMockCryptoData();
        }
    }

    async getNews() {
        return [
            { title: 'Fed Signals Interest Rate Cuts in 2026', source: 'Reuters', time: '2 hours ago' },
            { title: 'Tech Stocks Rally on AI Optimism', source: 'Bloomberg', time: '3 hours ago' },
            { title: 'Crypto Market Shows Strong Recovery', source: 'CoinDesk', time: '1 hour ago' },
            { title: 'European Markets Close Higher', source: 'Financial Times', time: '4 hours ago' },
            { title: 'Oil Prices Surge on Geopolitical Tensions', source: 'MarketWatch', time: '5 hours ago' },
        ];
    }

    async getEconomicCalendar() {
        return [
            { date: '2026-03-04', time: '14:30', event: 'Initial Jobless Claims', impact: 'high', forecast: '220K', previous: '225K' },
            { date: '2026-03-05', time: '15:00', event: 'Non-Farm Payroll', impact: 'high', forecast: '250K', previous: '275K' },
            { date: '2026-03-06', time: '13:30', event: 'CPI Release', impact: 'high', forecast: '3.2%', previous: '3.4%' },
            { date: '2026-03-09', time: '14:00', event: 'FOMC Meeting', impact: 'high', forecast: '--', previous: '5.25-5.50%' },
        ];
    }

    generateMockStockData(symbol) {
        const basePrice = Math.random() * 300 + 50;
        return {
            symbol: symbol,
            price: basePrice,
            change: (Math.random() - 0.5) * 20,
            changePercent: (Math.random() - 0.5) * 5,
            volume: Math.floor(Math.random() * 100000000),
            timestamp: new Date(),
        };
    }

    generateMockCryptoData() {
        return {
            bitcoin: { usd: 45000 + Math.random() * 5000, usd_24h_change: (Math.random() - 0.5) * 10 },
            ethereum: { usd: 2500 + Math.random() * 500, usd_24h_change: (Math.random() - 0.5) * 10 },
            cardano: { usd: 0.5 + Math.random() * 0.2, usd_24h_change: (Math.random() - 0.5) * 15 },
            solana: { usd: 100 + Math.random() * 50, usd_24h_change: (Math.random() - 0.5) * 12 },
        };
    }
}

const apiService = new APIService(CONFIG);class APIService {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000;
    }

    getCached(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < this.cacheExpiry) {
            return item.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCached(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    async getStockQuote(symbol) {
        const cacheKey = `stock_${symbol}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(this.config.API_ENDPOINTS.ALPHA_VANTAGE, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: this.config.API_KEYS.ALPHA_VANTAGE,
                },
            });

            if (response.data['Global Quote'] && Object.keys(response.data['Global Quote']).length > 0) {
                const quote = response.data['Global Quote'];
                const data = {
                    symbol: symbol,
                    price: parseFloat(quote['05. price']),
                    change: parseFloat(quote['09. change']),
                    changePercent: parseFloat(quote['10. change percent']),
                    volume: parseInt(quote['06. volume']),
                    timestamp: new Date(),
                };
                this.setCached(cacheKey, data);
                return data;
            }
        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
        }

        return this.generateMockStockData(symbol);
    }

    async getCryptoPrices() {
        const cacheKey = 'crypto_prices';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.config.API_ENDPOINTS.COINGECKO}/simple/price`, {
                params: {
                    ids: 'bitcoin,ethereum,cardano,solana,polkadot,ripple,litecoin,dogecoin',
                    vs_currencies: 'usd',
                    include_market_cap: true,
                    include_24hr_vol: true,
                    include_24hr_change: true,
                },
            });

            this.setCached(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            return this.generateMockCryptoData();
        }
    }

    async getNews() {
        return [
            { title: 'Fed Signals Interest Rate Cuts in 2026', source: 'Reuters', time: '2 hours ago' },
            { title: 'Tech Stocks Rally on AI Optimism', source: 'Bloomberg', time: '3 hours ago' },
            { title: 'Crypto Market Shows Strong Recovery', source: 'CoinDesk', time: '1 hour ago' },
            { title: 'European Markets Close Higher', source: 'Financial Times', time: '4 hours ago' },
            { title: 'Oil Prices Surge on Geopolitical Tensions', source: 'MarketWatch', time: '5 hours ago' },
        ];
    }

    async getEconomicCalendar() {
        return [
            { date: '2026-03-04', time: '14:30', event: 'Initial Jobless Claims', impact: 'high', forecast: '220K', previous: '225K' },
            { date: '2026-03-05', time: '15:00', event: 'Non-Farm Payroll', impact: 'high', forecast: '250K', previous: '275K' },
            { date: '2026-03-06', time: '13:30', event: 'CPI Release', impact: 'high', forecast: '3.2%', previous: '3.4%' },
            { date: '2026-03-09', time: '14:00', event: 'FOMC Meeting', impact: 'high', forecast: '--', previous: '5.25-5.50%' },
        ];
    }

    generateMockStockData(symbol) {
        const basePrice = Math.random() * 300 + 50;
        return {
            symbol: symbol,
            price: basePrice,
            change: (Math.random() - 0.5) * 20,
            changePercent: (Math.random() - 0.5) * 5,
            volume: Math.floor(Math.random() * 100000000),
            timestamp: new Date(),
        };
    }

    generateMockCryptoData() {
        return {
            bitcoin: { usd: 45000 + Math.random() * 5000, usd_24h_change: (Math.random() - 0.5) * 10 },
            ethereum: { usd: 2500 + Math.random() * 500, usd_24h_change: (Math.random() - 0.5) * 10 },
            cardano: { usd: 0.5 + Math.random() * 0.2, usd_24h_change: (Math.random() - 0.5) * 15 },
            solana: { usd: 100 + Math.random() * 50, usd_24h_change: (Math.random() - 0.5) * 12 },
        };
    }
}

const apiService = new APIService(CONFIG);class APIService {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000;
    }

    getCached(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < this.cacheExpiry) {
            return item.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCached(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    async getStockQuote(symbol) {
        const cacheKey = `stock_${symbol}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(this.config.API_ENDPOINTS.ALPHA_VANTAGE, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: this.config.API_KEYS.ALPHA_VANTAGE,
                },
            });

            if (response.data['Global Quote'] && Object.keys(response.data['Global Quote']).length > 0) {
                const quote = response.data['Global Quote'];
                const data = {
                    symbol: symbol,
                    price: parseFloat(quote['05. price']),
                    change: parseFloat(quote['09. change']),
                    changePercent: parseFloat(quote['10. change percent']),
                    volume: parseInt(quote['06. volume']),
                    timestamp: new Date(),
                };
                this.setCached(cacheKey, data);
                return data;
            }
        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
        }

        return this.generateMockStockData(symbol);
    }

    async getCryptoPrices() {
        const cacheKey = 'crypto_prices';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.config.API_ENDPOINTS.COINGECKO}/simple/price`, {
                params: {
                    ids: 'bitcoin,ethereum,cardano,solana,polkadot,ripple,litecoin,dogecoin',
                    vs_currencies: 'usd',
                    include_market_cap: true,
                    include_24hr_vol: true,
                    include_24hr_change: true,
                },
            });

            this.setCached(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            return this.generateMockCryptoData();
        }
    }

    async getNews() {
        return [
            { title: 'Fed Signals Interest Rate Cuts in 2026', source: 'Reuters', time: '2 hours ago' },
            { title: 'Tech Stocks Rally on AI Optimism', source: 'Bloomberg', time: '3 hours ago' },
            { title: 'Crypto Market Shows Strong Recovery', source: 'CoinDesk', time: '1 hour ago' },
            { title: 'European Markets Close Higher', source: 'Financial Times', time: '4 hours ago' },
            { title: 'Oil Prices Surge on Geopolitical Tensions', source: 'MarketWatch', time: '5 hours ago' },
        ];
    }

    async getEconomicCalendar() {
        return [
            { date: '2026-03-04', time: '14:30', event: 'Initial Jobless Claims', impact: 'high', forecast: '220K', previous: '225K' },
            { date: '2026-03-05', time: '15:00', event: 'Non-Farm Payroll', impact: 'high', forecast: '250K', previous: '275K' },
            { date: '2026-03-06', time: '13:30', event: 'CPI Release', impact: 'high', forecast: '3.2%', previous: '3.4%' },
            { date: '2026-03-09', time: '14:00', event: 'FOMC Meeting', impact: 'high', forecast: '--', previous: '5.25-5.50%' },
        ];
    }

    generateMockStockData(symbol) {
        const basePrice = Math.random() * 300 + 50;
        return {
            symbol: symbol,
            price: basePrice,
            change: (Math.random() - 0.5) * 20,
            changePercent: (Math.random() - 0.5) * 5,
            volume: Math.floor(Math.random() * 100000000),
            timestamp: new Date(),
        };
    }

    generateMockCryptoData() {
        return {
            bitcoin: { usd: 45000 + Math.random() * 5000, usd_24h_change: (Math.random() - 0.5) * 10 },
            ethereum: { usd: 2500 + Math.random() * 500, usd_24h_change: (Math.random() - 0.5) * 10 },
            cardano: { usd: 0.5 + Math.random() * 0.2, usd_24h_change: (Math.random() - 0.5) * 15 },
            solana: { usd: 100 + Math.random() * 50, usd_24h_change: (Math.random() - 0.5) * 12 },
        };
    }
}

const apiService = new APIService(CONFIG);
