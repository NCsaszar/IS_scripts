class ProfitCalculator {
  constructor(marketData, itemData) {
    this.marketData = marketData;
    this.itemData = itemData;
    this.profits = {};
  }

  calculate() {
    let items = this.getRelevantItemPrices();

    items.forEach((item) => {
      let price = item.minPrice;
      let qty = itemsData[item.name];
      let total = price * qty;
      profits[item.name] = total.toLocaleString();
    });
    return this.profits;
  }

  getRelevantItemPrices() {
    // Check if marketPrices is available
    if (!this.marketData || !this.itemData) {
      console.error('Required data not available');
      return;
    }
    // Get the keys from itemsData (item names)
    let itemNames = Object.keys(this.itemsData);
    // Filter the market data for items present in itemsData
    let relevantPrices = this.marketData.filter((marketItem) => itemNames.includes(marketItem.name));

    return relevantPrices;
  }
}
