var Api = require('./Api');
var random = require("random-js")();
var randomFloat = require('random-float');

class BotManager {
  constructor(coinSettings, priceGroups) {
    coinSettings.map(coinSetting => coinSetting.precision = Math.log10(coinSetting.precision));
    this.coins = [...new Set(coinSettings.map(item => item.coin))];
    this.currencies = [...new Set(coinSettings.map(item => item.currency))];
    this.tradeTypes = ['buy', 'sell'];
    this.types = ['limit', 'stop_limit'];
    let avgPrices = {
      'btc': 5165000,
      'bch': 286500,
      'etc': 64800,
      'eth': 154200,
      'ltc': 38580 ,
      'xrp': 504,
      'dash': 160650,
      'neo': 10500,
      'qtum': 2740,
      'usdt': 1115
    };
    this.prices = [];
    this.minPriceRatio = 0.75;
    this.maxPriceRatio = 1.25;
    this.createPrices(avgPrices, 'krw');
    this.createPrices(avgPrices, 'btc', avgPrices['btc']);
    this.createPrices(avgPrices, 'eth', avgPrices['eth']);
    this.createPrices(avgPrices, 'usdt', avgPrices['usdt']);
    this.runBots(coinSettings);
  }

  createPrices(avgPrices, currency, basePrice = 1) {
    Object.keys(avgPrices).map(coin => {
      let pair = `${coin}_${currency}`;
      this.prices[pair] = {};
      this.prices[pair].maxPrice = currency === 'krw' ? Math.floor(this.maxPriceRatio * avgPrices[coin]) : (this.maxPriceRatio * avgPrices[coin] / basePrice);
      this.prices[pair].minPrice = currency === 'krw' ? Math.floor(this.minPriceRatio * avgPrices[coin]) : (this.minPriceRatio * avgPrices[coin] / basePrice);
    });
  }

  async runBots(coinSettings) {
    await setInterval(() => {
      let i = random.integer(2, 30 + 2);
      let email = `bot${i}@gmail.com`;
      let password = i < 10 ? '123123' : '1231234';
      let api = new Api();
      let order = this.getOrderRandom(coinSettings);
      api.createOrder({username: email, password: password}, order);
    }, 3000);
  }

  getOrderRandom(coinSettings) {
    let coin = this.coins[random.integer(0, this.coins.length - 1)];
    let currency = this.currencies[random.integer(0, this.currencies.length - 1)];
    let type = this.types[random.integer(0, this.types.length - 1)];
    let tradeType = this.tradeTypes[random.integer(0, this.tradeTypes.length - 1)];
    let pairInfo = coinSettings.find(coinSetting => coinSetting.coin === coin && coinSetting.currency === currency) || {};
    let precision = Math.abs(pairInfo.precision);
    let pair = `${coin}_${currency}`;
    let price = parseFloat(randomFloat(this.prices[pair].minPrice, this.prices[pair].maxPrice)).toFixed(precision);
    let quantity = this.randomQuantity(coin, currency, pairInfo.minimum_quantity);

    return {
      coin: coin,
      currency: currency,
      type: type,
      tradeType: tradeType,
      ioc: 1,
      price: price,
      quantity: quantity
    }
  }

  randomQuantity(coin, currency, minimumQuantity) {
    return randomFloat(minimumQuantity * 10, minimumQuantity * 10000);
  }
}

module.exports = BotManager;
