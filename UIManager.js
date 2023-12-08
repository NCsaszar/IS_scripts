class UIManager {
  constructor(profits) {
    this.buffsObserver = new MutationObserver(this.handleBuffsMutation.bind(this));
    this.switchObserver = new MutationObserver(this.handleSwitchMutation.bind(this));

    this.profits = profits; // This assumes profits are passed to the UI Manager or calculated within
  }

  initObservers() {
    this.buffsObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.switchObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  handleBuffsMutation(mutations, obs) {
    var buffsBar = document.querySelector('.buffs-container'); // Replace with actual selector
    if (buffsBar) {
      this.setupIcon();
      obs.disconnect(); // Disconnect after appending the stats
    }
  }

  handleSwitchMutation(mutations) {
    var switchElement = document.getElementById('loot-log-per-hour');
    if (switchElement && !switchElement.checked) {
      switchElement.click();
      this.switchObserver.disconnect(); // Disconnect after clicking
    }
  }

  setupIcon() {
    var icon = document.createElement('img');
    icon.src = '/images/money_icon.png';
    icon.id = 'money_calc';
    icon.alt = 'money calc';
    icon.className = 'header-league-icon';
    icon.style = 'pointer-events: all !important;';
    icon.onclick = this.createModal.bind(this);

    var nav = document.querySelector('.navbar1-box.left.drawer-button');
    if (nav) {
      nav.parentNode.insertBefore(icon, nav.nextSibling);
    }
  }

  createModal() {
    var existingModal = document.getElementById('gold-stats-modal');
    if (existingModal) {
      existingModal.style.display = existingModal.style.display === 'none' ? 'block' : 'none';
      this.updateModalContent(existingModal);
    } else {
      // Create modal container
      var modal = document.createElement('div');
      modal.id = 'gold-stats-modal';
      modal.className = 'css-1k15hhc right-panel-container';
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.zIndex = '1000';
      modal.style.width = '300px';
      modal.style.maxHeight = '500px';

      var header = document.createElement('div');
      header.className = 'modal-header';
      modal.appendChild(header);

      var profitsContent = document.createElement('div');
      profitsContent.className = 'profits-content';
      modal.appendChild(profitsContent);

      document.body.appendChild(modal);
      this.updateModalContent(modal);
    }
  }

  updateModalContent(modal) {
    var totalProfit = 0;
    var profitsContent = modal.querySelector('.profits-content');
    var header = modal.querySelector('.modal-header');

    var profitsHtml = '<ul>';
    for (var item in this.profits) {
      var profitValue = parseFloat(this.profits[item].replace(/,/g, ''));
      totalProfit += profitValue;
      profitsHtml += '<li>' + item + ': ' + this.profits[item] + '/hr' + '</li>';
    }
    profitsHtml += '</ul>';
    profitsContent.innerHTML = profitsHtml;
    this.updateTotalProfitDisplay(header, totalProfit);
  }

  updateTotalProfitDisplay(header, totalProfit) {
    var totalDisplay = header.querySelector('.total-profit-display');
    if (!totalDisplay) {
      totalDisplay = document.createElement('div');
      totalDisplay.className = 'total-profit-display';
      totalDisplay.style.backgroundImage = 'url(/images/ui/stone_button_gray.png)';
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
}
