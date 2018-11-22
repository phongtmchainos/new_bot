var Api = require('./Api');
var random = require("random-js")();
var randomFloat = require('random-float');

class BotManager {
  constructor() {
    this.coins = ['btc', 'eth', 'bch', 'xrp', 'ltc', 'etc', 'dash', 'neo', 'qtumn'];
    this.currencies = ['krw', 'usdt', 'btc', 'eth'];
    this.tradeTypes = ['buy', 'sell'];
    this.types = ['limit', 'stop_limit'];
    this.stopCondition = ['ge', 'le'];
    let avgPrices = {
      'btc': 5222000,
      'bch': 51413,
      'etc': 12012,
      'eth': 350034,
      'ltc': 293000 ,
      'xrp': 206,
      'dash': 9758,
      'neo': 10500,
      'qtum': 2740,
      'usdt': 1115
    };
    this.prices = [];
    this.minPriceRatio = 0.75;
    this.maxPriceRatio = 1.25;
    this.minBasePriceRatio = 0.8;
    this.createPrices(avgPrices, 'krw');
    this.createPrices(avgPrices, 'btc', avgPrices['btc']);
    this.createPrices(avgPrices, 'eth', avgPrices['eth']);
    this.createPrices(avgPrices, 'usdt', avgPrices['usdt']);
    this.runBots();
  }

  createPrices(avgPrices, currency, basePrice = 1) {
    Object.keys(avgPrices).map(coin => {
      let pair = `${coin}_${currency}`;
      this.prices[pair] = {};
      this.prices[pair].maxPrice = currency === 'krw' ? Math.floor(this.maxPriceRatio * avgPrices[coin]) : (this.maxPriceRatio * avgPrices[coin] / basePrice);
      this.prices[pair].minPrice = currency === 'krw' ? Math.floor(this.minPriceRatio * avgPrices[coin]) : (this.minPriceRatio * avgPrices[coin] / basePrice);
    });
  }

  async runBots() {
    await setInterval(() => {
      let i = random.integer(2, 30 + 2);
      let email = `bot${i}@gmail.com`;
      let password = i < 10 ? '123123' : '1231234';
      let order = this.getOrderRandom();
      new Api(email, password, order);
    }, 3000);
  }

  getOrderRandom() {
    let coin = this.coins[random.integer(0, this.coins.length - 1)];
    let currency = this.currencies[random.integer(0, this.currencies.length - 1)];
    while (coin === currency) {
      coin = this.coins[random.integer(0, this.coins.length - 1)];
    }
    let type = this.types[random.integer(0, this.types.length - 1)];
    let tradeType = this.tradeTypes[random.integer(0, this.tradeTypes.length - 1)];
    let pair = `${coin}_${currency}`;
    let precision = 0;
    switch (currency) {
      case 'usdt': precision = 3; break;
      case 'btc': precision = 8; break;
      case 'eth': precision = 8; break;
      default: precision = 0;
    }
    let price = 0;
    if (currency === 'krw') {
      price = parseInt(randomFloat(this.prices[pair].minPrice, this.prices[pair].maxPrice) / 50).toFixed(precision) * 50;
    } else {
      price = parseFloat(randomFloat(this.prices[pair].minPrice, this.prices[pair].maxPrice)).toFixed(precision);
    }

    let quantity = 0;
    if (coin === 'btc') {
      quantity = parseFloat(randomFloat(0.01, 5)).toFixed(2);
    } else if (currency === 'krw' && (coin === 'dash' || coin === 'xrp')) {
      quantity = random.integer(200, 10000);
    } else {
      quantity = random.integer(1, 100);
    }
    let order = {
      coin: coin,
      currency: currency,
      type: type,
      trade_type: tradeType,
      price: price.toString(),
      quantity: quantity.toString(),
    };
    order = Object.assign(order, {ioc: Math.random() < 0.5 ? 0 : 1});
    if (type === 'stop_limit' || type === 'stop_market') {
      let stopCondition = this.stopCondition[random.integer(0, 1)];
      let basePrice = 0;
      if (currency === 'krw') {
        basePrice = parseInt(price * this.minBasePriceRatio).toFixed(precision).toString();
      } else {
        basePrice = parseFloat(price * this.minBasePriceRatio).toFixed(precision).toString();
      }
      order = Object.assign(order, {base_price: basePrice, stop_condition: stopCondition});
    }
    return order;
  }
}

module.exports = BotManager;
