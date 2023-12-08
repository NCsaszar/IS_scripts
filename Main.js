// ==UserScript==
// @name         Money Calc
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto-click switch in Idlescape and collect data
// @author       Ceezur
// @match        https://www.play.idlescape.com/
// @grant        none
// @require      https://raw.githubusercontent.com/NCsaszar/IS_scripts/main/MarketData.js
// @require      https://raw.githubusercontent.com/NCsaszar/IS_scripts/main/ItemData.js
// @require      https://raw.githubusercontent.com/NCsaszar/IS_scripts/main/ProfitCalculator.js
// @require      https://raw.githubusercontent.com/NCsaszar/IS_scripts/main/UIManager.js
// ==/UserScript==

(function () {
  ('use strict');
  const marketData = new MarketData();
  const itemData = new ItemData();
  const profitCalculator = new ProfitCalculator(marketData.data, itemData.data);
  const uiManager = new UIManager(profitCalculator.profits);
  // Initialize UI observers
  uiManager.initObservers();
  //attach to window
  window.marketData = marketData;
  window.itemData = itemData;
  window.profitCalculator = profitCalculator;
  window.uiManager = uiManager;

  // Fetch market data and update at intervals
  marketData.fetchMarketData();
  setInterval(() => marketData.fetchMarketData(), 1000 * 6 * 10);

  // Collect item data and update at intervals
  setInterval(() => itemData.collectData(), 1000);

  // Calculate profits and update UI at intervals
  setInterval(() => {
    profitCalculator.setItemData(window.itemData.data);
    profitCalculator.setMarketData(window.marketData.data);
    profitCalculator.calculate();
    var modal = document.getElementById('gold-stats-modal');
    uiManager.updateModalContent(modal, profitCalculator.profits);
  }, 1000);
})();
