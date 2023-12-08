// ==UserScript==
// @name         Money Calc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-click switch in Idlescape and collect data
// @author       Ceezur
// @match        https://www.play.idlescape.com/
// @grant        none
// ==/UserScript==

(function () {
  ('use strict');
  const marketData = new MarketData();
  const itemData = new ItemData();
  const profitCalculator = new ProfitCalculator(marketData, itemData);
  const uiManager = new UIManager(profitCalculator.profits);
  // Initialize UI observers
  uiManager.initObservers();

  // Fetch market data and update at intervals
  marketData.fetchMarketData();
  setInterval(() => marketData.fetchMarketData(), 1000 * 6 * 10);

  // Collect item data and update at intervals
  setInterval(() => itemData.collectData(), 1000);

  // Calculate profits and update UI at intervals
  setInterval(() => {
    profitCalculator.calculate();
    var modal = document.getElementById('gold-stats-modal');
    uiManager.updateModalContent(modal);
  }, 1000);
})();
