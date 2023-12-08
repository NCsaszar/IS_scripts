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
  var marketDataLoaded = false;
  var itemsDataLoaded = false;
  var itemsData = {};
  var profits = {};

  var buffsObserver = new MutationObserver(function (mutations, obs) {
    var buffsBar = document.querySelector('.buffs-container'); // Replace with actual selector

    if (buffsBar) {
      setupIcon();
      obs.disconnect(); // Disconnect after appending the stats
    }
  });

  buffsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  var observer = new MutationObserver(function (mutations) {
    var switchElement = document.getElementById('loot-log-per-hour');
    if (switchElement && !switchElement.checked) {
      switchElement.click();
      console.log('Switch clicked');
      observer.disconnect(); // Disconnect after clicking
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Function to collect data
  function collectData() {
    var parentElements = document.querySelectorAll('.css-beqtzb');

    parentElements.forEach((parentElem) => {
      var itemNameElem = parentElem.querySelector('.chat-item');
      var itemName = itemNameElem ? itemNameElem.textContent.trim() : null;

      var rateElem = parentElem.querySelector('.css-722v25');
      var rate = rateElem ? rateElem.textContent.trim() : null;

      if (itemName && rate) {
        var rateValue = parseFloat(rate.replace('/hr', '').replace(/,/g, ''), 10);
        itemsData[itemName] = rateValue;
      }
    });

    itemsDataLoaded = true;
    return itemsData;
  }

  async function fetchMarketData() {
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
      marketDataLoaded = true;
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }

  function getRelevantItemPrices() {
    // Check if marketPrices is available
    if (!window.marketPrices || !itemsDataLoaded) {
      console.error('Required data not available');
      return;
    }

    // Get the keys from itemsData (item names)
    let itemNames = Object.keys(itemsData);

    // Filter the market data for items present in itemsData
    let relevantPrices = window.marketPrices.filter((marketItem) => itemNames.includes(marketItem.name));

    return relevantPrices;
  }

  function getProfitPerItem() {
    let items = getRelevantItemPrices();

    items.forEach((item) => {
      let price = item.minPrice;
      let qty = itemsData[item.name];
      let total = price * qty;
      profits[item.name] = total.toLocaleString();
    });
  }

  function setupIcon() {
    var icon = document.createElement('img');
    icon.src = '/images/money_icon.png';
    icon.id = 'money_calc';
    icon.alt = 'money calc';
    icon.className = 'header-league-icon';
    icon.style = 'pointer-events: all !important;';
    icon.onclick = createModal;

    var nav = document.querySelector('.navbar1-box.left.drawer-button');
    if (nav) {
      nav.parentNode.insertBefore(icon, nav.nextSibling);
    }
  }

  function createModal() {
    var existingModal = document.getElementById('gold-stats-modal');
    if (existingModal) {
      existingModal.style.display = existingModal.style.display === 'none' ? 'block' : 'none';
      updateModalContent(existingModal);
    } else {
      // Create modal container
      var modal = document.createElement('div');
      modal.id = 'gold-stats-modal';
      modal.className = 'css-1k15hhc';
      modal.className = 'right-panel-container';
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.zIndex = '1000';
      modal.style.backgroundImage = 'url("/images/ui/stone-9slice-dark-gray.png")';
      modal.style.width = '300px';
      modal.style.maxHeight = '500px';

      var header = document.createElement('div');
      header.className = 'modal-header';
      modal.appendChild(header);

      var profitsContent = document.createElement('div');
      profitsContent.className = 'profits-content';
      modal.appendChild(profitsContent);

      document.body.appendChild(modal);
      updateModalContent(modal);
    }
  }

  function updateModalContent(modal) {
    var totalProfit = 0;
    var profitsContent = modal.querySelector('.profits-content');
    var header = modal.querySelector('.modal-header');

    var profitsHtml = '<ul>';
    for (var item in profits) {
      var profitValue = parseFloat(profits[item].replace(/,/g, ''));
      totalProfit += profitValue;
      profitsHtml += '<li>' + item + ': ' + profits[item] + '/hr' + '</li>';
    }
    profitsHtml += '</ul>';
    profitsContent.innerHTML = profitsHtml;
    updateTotalProfitDisplay(header, totalProfit);
  }

  function updateTotalProfitDisplay(header, totalProfit) {
    var totalDisplay = header.querySelector('.total-profit-display');
    if (!totalDisplay) {
      totalDisplay = document.createElement('div');
      totalDisplay.className = 'total-profit-display';
      totalDisplay.style.backgroundImage = 'url(/images/ui/stone_button_gray.png';
      totalDisplay.style.height = '30px';
      totalDisplay.style.display = 'flex';
      totalDisplay.style.alignItems = 'center';
      totalDisplay.style.justifyContent = 'center';
      totalDisplay.style.color = 'rgb(0 255 177)';
      totalDisplay.style.textShadow =
        'rgb(0, 0, 0) 2px 2px 2px, rgb(0, 0, 0) 0px 1px, rgb(0, 0, 0) 1px 0px, rgb(0, 0, 0) 0px -1px';
      totalDisplay.style.fontSize = '18px';
      header.appendChild(totalDisplay);
    }
    totalDisplay.innerHTML = 'Total Profit: ' + totalProfit.toLocaleString() + '/hr';
  }

  fetchMarketData();
  setInterval(fetchMarketData, 1000 * 6 * 10);
  setInterval(collectData, 1000);
  setInterval(getProfitPerItem, 1000);
  setInterval(() => {
    var modal = document.getElementById('gold-stats-modal');
    updateModalContent(modal);
  }, 1000);
})();
