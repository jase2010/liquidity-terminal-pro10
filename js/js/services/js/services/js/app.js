class LiquidityTerminal {
    constructor() {
        this.currentView = 'dashboard';
        this.currentSymbol = 'SPY';
        this.refreshIntervals = new Map();
        this.init();
    }

    async init() {
        try {
            this.setupDOM();
            this.setupEventListeners();
            this.restorePreferences();
            await this.loadDashboard();
            console.log('Liquidity Terminal initialized');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize application');
        }
    }

    setupDOM() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchView(btn.dataset.view);
            });
        });

        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('addPositionBtn').addEventListener('click', () => {
            document.getElementById('addPositionModal').classList.add('show');
        });

        document.getElementById('addPositionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPosition();
        });

        document.getElementById('newAlertBtn').addEventListener('click', () => {
            document.getElementById('newAlertModal').classList.add('show');
        });

        document.getElementById('newAlertForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAlert();
        });

        document.getElementById('addWatchlistBtn').addEventListener('click', () => {
            this.addToWatchlist();
        });

        document.getElementById('watchlistInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addToWatchlist();
                e.preventDefault();
            }
        });

        document.getElementById('aiSendBtn').addEventListener('click', () => {
            this.sendAIMessage();
        });

        document.getElementById('aiInput').addEventListener('keypress', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.sendAIMessage();
            }
        });

        document.getElementById('screenBtn').addEventListener('click', () => {
            this.performScreening();
        });

        document.getElementById('resetScreenBtn').addEventListener('click', () => {
            this.resetScreener();
        });

        document.querySelectorAll('.market-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.loadMarkets(e.target.dataset.market);
            });
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                document.querySelector(`[data-content="${e.target.dataset.tab}"]`).classList.add('active');
            });
        });
    }

    restorePreferences() {
        const prefs = storageService.getPreferences();
        if (prefs.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    switchView(viewName) {
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');
        document.getElementById(`${viewName}-view`)?.classList.add('active');

        this.currentView = viewName;

        switch (viewName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'screener':
                this.loadScreener();
                break;
            case 'portfolio':
                this.loadPortfolio();
                break;
            case 'markets':
                this.loadMarkets('stocks');
                break;
            case 'ai-assistant':
                this.initAIAssistant();
                break;
        }
    }

    async loadDashboard() {
        this.startAutoRefresh('dashboard', async () => {
            await this.updateMarketData();
            await this.loadNews();
            await this.loadEconomicCalendar();
            await this.updateMarketBias();
            this.renderWatchlist();
            this.renderSidebar();
        }, CONFIG.REFRESH_INTERVALS.MARKET_DATA);

        await this.updateMarketData();
    }

    async updateMarketData() {
        try {
            const data = await apiService.getStockQuote(this.currentSymbol);
            this.renderMarketOverview(data);
            this.renderCharts();
        } catch (error) {
            console.error('Error updating market data:', error);
        }
    }

    renderMarketOverview(data) {
        const html = `
            <div class="summary-item">
                <div class="summary-item-label">Price</div>
                <div class="summary-item-value">$${data.price.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-item-label">Change</div>
                <div class="summary-item-value ${data.change >= 0 ? 'positive' : 'negative'}">
                    ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} (${data.changePercent.toFixed(2)}%)
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-item-label">Volume</div>
                <div class="summary-item-value">${this.formatNumber(data.volume)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-item-label">Updated</div>
                <div class="summary-item-value">${data.timestamp.toLocaleTimeString()}</div>
            </div>
        `;
        document.getElementById('marketSummary').innerHTML = html;
    }

    renderCharts() {
        this.renderPerformanceChart();
        this.renderCryptoChart();
        this.renderSectorChart();
        this.renderVolatilityChart();
    }

    renderPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const labels = [];
        const data = [];
        let value = 100;

        for (let i = 0; i < 30; i++) {
            labels.push(`Day ${i + 1}`);
            value += (Math.random() - 0.5) * 5;
            data.push(value);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: `${this.currentSymbol} Performance`,
                    data,
                    borderColor: '#1e88e5',
                    backgroundColor: 'rgba(30, 136, 229, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, labels: { color: getComputedStyle(document.body).color } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { color: getComputedStyle(document.body).color }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.body).color },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderCryptoChart() {
        const ctx = document.getElementById('cryptoChart');
        if (!ctx) return;

        const cryptoSymbols = ['BTC', 'ETH', 'ADA', 'SOL'];
        const cryptoPrices = [45000, 2500, 0.5, 100].map(p => p + (Math.random() - 0.5) * p * 0.1);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cryptoSymbols,
                datasets: [{
                    label: 'Crypto Prices (USD)',
                    data: cryptoPrices,
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, labels: { color: getComputedStyle(document.body).color } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: getComputedStyle(document.body).color }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.body).color }
                    }
                }
            }
        });
    }

    renderSectorChart() {
        const ctx = document.getElementById('sectorChart');
        if (!ctx) return;

        const sectors = ['Tech', 'Healthcare', 'Finance', 'Consumer', 'Energy'];
        const performance = [5.2, 3.1, 2.8, 1.5, -0.5];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sectors,
                datasets: [{
                    label: '% Change',
                    data: performance,
                    backgroundColor: performance.map(p => p >= 0 ? '#43a047' : '#e53935')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: getComputedStyle(document.body).color } },
                    x: { ticks: { color: getComputedStyle(document.body).color } }
                }
            }
        });
    }

    renderVolatilityChart() {
        const ctx = document.getElementById('volatilityChart');
        if (!ctx) return;

        const labels = [];
        const data = [];

        for (let i = 0; i < 20; i++) {
            labels.push(`${i}`);
            data.push(15 + Math.random() * 20);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'VIX Index',
                    data,
                    borderColor: '#fb8c00',
                    backgroundColor: 'rgba(251, 140, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, labels: { color: getComputedStyle(document.body).color } } },
                scales: {
                    y: { ticks: { color: getComputedStyle(document.body).color } },
                    x: { ticks: { color: getComputedStyle(document.body).color }, grid: { display: false } }
                }
            }
        });
    }

    async loadNews() {
        try {
            const news = await apiService.getNews();
            const html = news.map(article => `
                <div class="news-item">
                    <div class="news-item-title">${article.title}</div>
                    <div class="news-item-source">${article.source}</div>
                    <div class="news-item-time">${article.time}</div>
                </div>
            `).join('');
            document.getElementById('newsFeed').innerHTML = html || '<p>No news available</p>';
        } catch (error) {
            console.error('Error loading news:', error);
        }
    }

    async loadEconomicCalendar() {
        try {
            const events = await apiService.getEconomicCalendar();
            const tableHtml = `
                <table class="calendar-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Event</th>
                            <th>Impact</th>
                            <th>Forecast</th>
                            <th>Previous</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${events.map(event => `
                            <tr>
                                <td>${event.date}</td>
                                <td>${event.time}</td>
                                <td class="event-name">${event.event}</td>
                                <td><span class="event-impact ${event.impact}">${event.impact.toUpperCase()}</span></td>
                                <td>${event.forecast}</td>
                                <td>${event.previous}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            document.getElementById('economicCalendar').innerHTML = tableHtml;
        } catch (error) {
            console.error('Error loading calendar:', error);
        }
    }

    async updateMarketBias() {
        const bias = Math.random() * 100;
        const indicator = document.getElementById('biasIndicator');
        const label = document.getElementById('biasLabel');

        if (indicator) {
            indicator.style.left = bias + '%';
        }

        if (label) {
            if (bias > 70) {
                label.textContent = '📈 Strongly Bullish';
                label.style.color = '#43a047';
            } else if (bias > 55) {
                label.textContent = '📈 Mildly Bullish';
                label.style.color = '#66bb6a';
            } else if (bias > 45) {
                label.textContent = '➡️ Neutral';
                label.style.color = '#fbc02d';
            } else if (bias > 30) {
                label.textContent = '📉 Mildly Bearish';
                label.style.color = '#ef5350';
            } else {
                label.textContent = '📉 Strongly Bearish';
                label.style.color = '#e53935';
            }
        }
    }

    renderWatchlist() {
        const watchlist = storageService.getWatchlist();
        const html = watchlist.map(symbol => `
            <button class="watchlist-btn" data-symbol="${symbol}">
                <span>${symbol}</span>
                <button class="remove-btn" onclick="app.removeFromWatchlist('${symbol}')">×</button>
            </button>
        `).join('');
        document.getElementById('watchlistItems').innerHTML = html;

        document.querySelectorAll('.watchlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-btn')) {
                    this.currentSymbol = btn.dataset.symbol;
                    this.updateMarketData();
                }
            });
        });
    }

    renderSidebar() {
        this.renderWatchlist();
        this.renderAlerts();
        this.updateQuickStats();
    }

    renderAlerts() {
        const alerts = storageService.getAlerts();
        const html = alerts.slice(0, 5).map(alert => `
            <div class="alert-item">
                <div class="alert-symbol">${alert.symbol}</div>
                <div class="alert-condition">${alert.type}: ${alert.value}</div>
            </div>
        `).join('');
        document.getElementById('alertsList').innerHTML = html || '<p style="font-size:0.8rem;color:var(--color-text-lighter);">No active alerts</p>';
    }

    updateQuickStats() {
        const portfolio = storageService.getPortfolio();
        let totalValue = 0;
        portfolio.forEach(pos => {
            totalValue += (pos.shares * pos.currentPrice || pos.shares * pos.costPerShare);
        });

        document.getElementById('quickPortfolioValue').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('quick24hChange').textContent = `${(Math.random() - 0.5) * 10}.00%`;
    }

    addToWatchlist() {
        const input = document.getElementById('watchlistInput');
        const symbol = input.value.toUpperCase();

        if (symbol && /^[A-Z0-9]{1,5}$/.test(symbol)) {
            if (storageService.addToWatchlist(symbol)) {
                this.renderWatchlist();
                input.value = '';
            }
        }
    }

    removeFromWatchlist(symbol) {
        storageService.removeFromWatchlist(symbol);
        this.renderWatchlist();
    }

    async loadPortfolio() {
        this.renderPortfolioHoldings();
        this.updatePortfolioStats();
        this.renderAllocationChart();
    }

    addPosition() {
        const symbol = document.getElementById('posSymbol').value.toUpperCase();
        const shares = parseFloat(document.getElementById('posShares').value);
        const cost = parseFloat(document.getElementById('posCost').value);

        if (!symbol || !shares || !cost || shares <= 0 || cost <= 0) {
            this.showError('Please fill all fields with valid values');
            return;
        }

        const position = {
            symbol,
            shares,
            costPerShare: cost,
            totalCost: shares * cost,
            currentPrice: cost + (Math.random() - 0.5) * 10,
        };

        storageService.addPosition(position);
        document.getElementById('addPositionForm').reset();
        document.getElementById('addPositionModal').classList.remove('show');
        this.loadPortfolio();
        this.showSuccess('Position added successfully');
    }

    createAlert() {
        const symbol = document.getElementById('alertSymbol').value.toUpperCase();
        const type = document.getElementById('alertType').value;
        const value = parseFloat(document.getElementById('alertValue').value);

        if (!symbol || !type || !value) {
            this.showError('Please fill all alert fields');
            return;
        }

        const alert = { symbol, type, value };
        storageService.addAlert(alert);
        document.getElementById('newAlertForm').reset();
        document.getElementById('newAlertModal').classList.remove('show');
        this.renderAlerts();
        this.showSuccess('Alert created successfully');
    }

    renderPortfolioHoldings() {
        const portfolio = storageService.getPortfolio();

        if (portfolio.length === 0) {
            document.getElementById('portfolioHoldings').innerHTML = '<p style="padding:2rem;text-align:center;color:var(--color-text-lighter);">No holdings yet. Add your first position!</p>';
            return;
        }

        const html = `
            <table class="holdings-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Shares</th>
                        <th>Avg Cost</th>
                        <th>Current Price</th>
                        <th>Total Value</th>
                        <th>Gain/Loss</th>
                        <th>Return %</th>
                    </tr>
                </thead>
                <tbody>
                    ${portfolio.map(pos => {
                        const currentValue = pos.shares * (pos.currentPrice || pos.costPerShare);
                        const gainLoss = currentValue - pos.totalCost;
                        const returnPercent = (gainLoss / pos.totalCost * 100).toFixed(2);
                        return `
                            <tr>
                                <td><strong>${pos.symbol}</strong></td>
                                <td>${pos.shares.toFixed(2)}</td>
                                <td>$${pos.costPerShare.toFixed(2)}</td>
                                <td>$${(pos.currentPrice || pos.costPerShare).toFixed(2)}</td>
                                <td>$${currentValue.toFixed(2)}</td>
                                <td class="${gainLoss >= 0 ? 'positive' : 'negative'}">
                                    ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)}
                                </td>
                                <td class="${returnPercent >= 0 ? 'positive' : 'negative'}">
                                    ${returnPercent >= 0 ? '+' : ''}${returnPercent}%
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('portfolioHoldings').innerHTML = html;
    }

    updatePortfolioStats() {
        const portfolio = storageService.getPortfolio();
        let totalValue = 0;
        let totalCost = 0;

        portfolio.forEach(pos => {
            const currentValue = pos.shares * (pos.currentPrice || pos.costPerShare);
            totalValue += currentValue;
            totalCost += pos.totalCost;
        });

        const totalReturn = totalValue - totalCost;
        const returnPercent = totalCost > 0 ? (totalReturn / totalCost * 100).toFixed(2) : 0;
        const riskScore = this.calculateRiskScore(portfolio);

        document.getElementById('portfolioValue').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('portfolioReturn').textContent = `${returnPercent}%`;
        document.getElementById('riskScore').textContent = riskScore;
        document.getElementById('diversification').textContent = portfolio.length;
    }

    calculateRiskScore(portfolio) {
        if (portfolio.length === 0) return '--';
        if (portfolio.length === 1) return '85';
        if (portfolio.length < 5) return '65';
        if (portfolio.length < 10) return '45';
        return '25';
    }

    renderAllocationChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        const portfolio = storageService.getPortfolio();
        const labels = portfolio.map(p => p.symbol);
        const data = portfolio.map(p => p.shares * (p.currentPrice || p.costPerShare));

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['#1e88e5', '#43a047', '#fb8c00', '#e53935', '#9c27b0', '#00bcd4']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, labels: { color: getComputedStyle(document.body).color } }
                }
            }
        });
    }

    async loadScreener() {
        await this.performScreening();
    }

    async performScreening() {
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'JPM', 'V'];
        const results = [];

        for (const symbol of symbols) {
            const data = await apiService.getStockQuote(symbol);
            if (data) {
                results.push({
                    ...data,
                    marketCap: (Math.random() * 2000 + 100).toFixed(1),
                    peRatio: (Math.random() * 50 + 10).toFixed(1),
                    eps: (Math.random() * 10 + 1).toFixed(2),
                    sector: CONFIG.SECTORS[Math.floor(Math.random() * CONFIG.SECTORS.length)],
                });
            }
        }

        this.displayScreenerResults(results);
    }

    displayScreenerResults(results) {
        const tableHtml = `
            <table class="screener-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Change %</th>
                        <th>Market Cap (B)</th>
                        <th>P/E Ratio</th>
                        <th>EPS</th>
                        <th>Sector</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(stock => `
                        <tr>
                            <td><strong>${stock.symbol}</strong></td>
                            <td>$${stock.price.toFixed(2)}</td>
                            <td class="${stock.changePercent >= 0 ? 'positive' : 'negative'}">
                                ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
                            </td>
                            <td>${stock.marketCap}</td>
                            <td>${stock.peRatio}</td>
                            <td>$${stock.eps}</td>
                            <td>${stock.sector}</td>
                            <td>${this.formatNumber(stock.volume)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('screenerResults').innerHTML = tableHtml;
    }

    resetScreener() {
        document.getElementById('symbolFilter').value = '';
        document.getElementById('sectorFilter').value = '';
        document.getElementById('marketCapMin').value = '';
        document.getElementById('peRatioMax').value = '';
        this.performScreening();
    }

    async loadMarkets(market) {
        try {
            let items = [];

            if (market === 'crypto') {
                const cryptoData = await apiService.getCryptoPrices();
                items = Object.entries(cryptoData).map(([key, data]) => ({
                    symbol: key.toUpperCase(),
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    price: data.usd,
                    change: data.usd_24h_change,
                }));
            } else if (market === 'stocks') {
                items = [
                    { symbol: 'AAPL', name: 'Apple', price: 180.45, change: 2.3 },
                    { symbol: 'MSFT', name: 'Microsoft', price: 420.50, change: 1.8 },
                    { symbol: 'GOOGL', name: 'Alphabet', price: 145.75, change: 3.2 },
                    { symbol: 'AMZN', name: 'Amazon', price: 185.20, change: 2.1 },
                    { symbol: 'TSLA', name: 'Tesla', price: 215.85, change: -1.5 },
                ];
            }

            this.displayMarketItems(items);
        } catch (error) {
            console.error(`Error loading ${market}:`, error);
            this.showError(`Failed to load ${market}`);
        }
    }

    displayMarketItems(items) {
        const html = items.map(item => `
            <div class="market-item">
                <div class="market-item-symbol">${item.symbol}</div>
                <div class="market-item-name">${item.name}</div>
                <div class="market-item-price">$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="market-item-change ${item.change >= 0 ? 'positive' : 'negative'}">
                    ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%
                </div>
            </div>
        `).join('');

        document.getElementById('marketsContent').innerHTML = html;
    }

    initAIAssistant() {
        const chatHistory = document.getElementById('chatHistory');
        if (chatHistory.children.length === 0) {
            this.addAIMessage('Hello! I\'m your AI Financial Assistant. What would you like to know?');
        }
    }

    sendAIMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addAIMessage(response);
        }, 500);
    }

    generateAIResponse(query) {
        const responses = {
            'inflation': 'Inflation erodes purchasing power. Higher inflation typically leads to higher interest rates, which can reduce stock valuations.',
            'portfolio': 'A balanced portfolio typically includes stocks (60%), bonds (30%), and cash (10%).',
            'crypto': 'Cryptocurrencies are highly volatile and speculative. Bitcoin and Ethereum are the largest by market cap.',
            'rate': 'Interest rates affect borrowing costs. Higher rates slow economic growth and reduce stock valuations.',
            'diversification': 'Diversification spreads risk across different asset classes, sectors, and geographies.',
            'default': 'That\'s a great question! I\'d recommend doing your own due diligence before making any investment decisions.'
        };

        for (const [key, response] of Object.entries(responses)) {
            if (query.toLowerCase().includes(key)) {
                return response;
            }
        }

        return responses.default;
    }

    addUserMessage(text) {
        const chatHistory = document.getElementById('chatHistory');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.innerHTML = `<div class="chat-bubble">${text}</div>`;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    addAIMessage(text) {
        const chatHistory = document.getElementById('chatHistory');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ai';
        messageDiv.innerHTML = `<div class="chat-bubble">${text}</div>`;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        storageService.updatePreferences({ theme: isDark ? 'dark' : 'light' });
        this.updateChartThemes();
    }

    updateChartThemes() {
        if (this.currentView === 'dashboard') {
            this.renderCharts();
        }
    }

    startAutoRefresh(view, callback, interval) {
        const key = `${view}_refresh`;
        this.clearAutoRefresh(key);
        callback();
        this.refreshIntervals.set(key, setInterval(callback, interval));
    }

    clearAutoRefresh(key) {
        if (this.refreshIntervals.has(key)) {
            clearInterval(this.refreshIntervals.get(key));
            this.refreshIntervals.delete(key);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return num.toString();
    }

    showError(message) {
        const notification = document.getElementById('errorNotification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
    }

    showSuccess(message) {
        const notification = document.getElementById('errorNotification');
        notification.textContent = message;
        notification.style.borderColor = '#43a047';
        notification.style.color = '#43a047';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            notification.style.borderColor = '';
            notification.style.color = '';
        }, 5000);
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LiquidityTerminal();
});
