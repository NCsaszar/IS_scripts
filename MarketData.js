class MarketData {
  constructor() {
    this.data = {};
  }

  async fetchMarketData() {
    try {
      // Fetch data from the API
      const response = await fetch('https://www.play.idlescape.com/api/market/manifest');
      const data = await response.json();

      if (data.status !== 'Success') {
        console.error('Failed to fetch market data');
        return;
      }
      const items = data.manifest.filter((item) => item.league === 1);

      window.marketPrices = items;
      this.data = items;
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }
}
