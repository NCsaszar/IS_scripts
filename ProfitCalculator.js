class ProfitCalculator {
  constructor(marketData, itemData) {
    this.marketData = marketData;
    this.itemData = itemData;
    this.profits = {};
  }

  calculate() {
    let items = this.getRelevantItemPrices();
    if (items.length > 0) {
      items.forEach((item) => {
        let price = item.minPrice;
        let qty = this.itemData[item.name];
        let total = price * qty;
        this.profits[item.name] = total.toLocaleString();
      });
      return this.profits;
    } else {
      return null;
    }
  }

  getRelevantItemPrices() {
    // Check if marketPrices is available
    if (!this.marketData || !this.itemData) {
      console.error('Required data not available');
      return;
    }
    // Get the keys from itemsData (item names)
    let itemNames = Object.keys(this.itemData);
    // Filter the market data for items present in itemsData
    let relevantPrices = this.marketData.filter((marketItem) => itemNames.includes(marketItem.name));
    return relevantPrices;
  }

  setMarketData(updatedMarketData) {
    this.marketData = updatedMarketData;
  }

  setItemData(updatedItemData) {
    this.itemData = updatedItemData;
  }
}
