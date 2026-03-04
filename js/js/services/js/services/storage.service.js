class StorageService {
    constructor(config) {
        this.config = config;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.get(this.config.STORAGE_KEYS.WATCHLIST)) {
            this.set(this.config.STORAGE_KEYS.WATCHLIST, this.config.DEFAULT_WATCHLIST);
        }
        if (!this.get(this.config.STORAGE_KEYS.PORTFOLIO)) {
            this.set(this.config.STORAGE_KEYS.PORTFOLIO, []);
        }
        if (!this.get(this.config.STORAGE_KEYS.ALERTS)) {
            this.set(this.config.STORAGE_KEYS.ALERTS, []);
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving to storage (${key}):`, error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from storage (${key}):`, error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from storage (${key}):`, error);
            return false;
        }
    }

    getWatchlist() {
        return this.get(this.config.STORAGE_KEYS.WATCHLIST, this.config.DEFAULT_WATCHLIST);
    }

    addToWatchlist(symbol) {
        const watchlist = this.getWatchlist();
        if (!watchlist.includes(symbol)) {
            watchlist.push(symbol);
            this.set(this.config.STORAGE_KEYS.WATCHLIST, watchlist);
            return true;
        }
        return false;
    }

    removeFromWatchlist(symbol) {
        const watchlist = this.getWatchlist().filter(s => s !== symbol);
        this.set(this.config.STORAGE_KEYS.WATCHLIST, watchlist);
        return true;
    }

    getPortfolio() {
        return this.get(this.config.STORAGE_KEYS.PORTFOLIO, []);
    }

    addPosition(position) {
        const portfolio = this.getPortfolio();
        position.id = Date.now();
        position.dateAdded = new Date().toISOString();
        portfolio.push(position);
        this.set(this.config.STORAGE_KEYS.PORTFOLIO, portfolio);
        return position;
    }

    removePosition(id) {
        const portfolio = this.getPortfolio().filter(p => p.id !== id);
        this.set(this.config.STORAGE_KEYS.PORTFOLIO, portfolio);
        return true;
    }

    getAlerts() {
        return this.get(this.config.STORAGE_KEYS.ALERTS, []);
    }

    addAlert(alert) {
        const alerts = this.getAlerts();
        alert.id = Date.now();
        alert.createdAt = new Date().toISOString();
        alerts.push(alert);
        this.set(this.config.STORAGE_KEYS.ALERTS, alerts);
        return alert;
    }

    removeAlert(id) {
        const alerts = this.getAlerts().filter(a => a.id !== id);
        this.set(this.config.STORAGE_KEYS.ALERTS, alerts);
        return true;
    }

    getPreferences() {
        return this.get(this.config.STORAGE_KEYS.PREFERENCES, {
            theme: 'light',
            currency: 'USD',
            language: 'en',
        });
    }

    updatePreferences(prefs) {
        const current = this.getPreferences();
        this.set(this.config.STORAGE_KEYS.PREFERENCES, { ...current, ...prefs });
        return this.getPreferences();
    }
}

const storageService = new StorageService(CONFIG);
