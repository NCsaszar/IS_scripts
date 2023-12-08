class ItemData {
  constructor() {
    this.data = {};
  }

  collectData() {
    var parentElements = document.querySelectorAll('.css-beqtzb');

    parentElements.forEach((parentElem) => {
      var itemNameElem = parentElem.querySelector('.chat-item');
      var itemName = itemNameElem ? itemNameElem.textContent.trim() : null;

      var rateElem = parentElem.querySelector('.css-722v25');
      var rate = rateElem ? rateElem.textContent.trim() : null;

      if (itemName && rate) {
        var rateValue = parseFloat(rate.replace('/hr', '').replace(/,/g, ''), 10);
        this.data[itemName] = rateValue;
      }
    });
  }
}
