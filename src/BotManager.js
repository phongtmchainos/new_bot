var Api = require('./Api');
var random = require("random-js")();

class BotManager {
  constructor() {
    this.coins = ['btc', 'eth', 'dash', 'eos', 'bltg'];
    this.runBots();
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
    let order = {
      coin: this.coins[random.integer(0, this.coins.length - 1)],
      currency: 'krw',
      type: 'limit',
      trade_type: Math.random() < 0.5 ? 'buy' : 'sell',
    };
    return order;
  }
}

module.exports = BotManager;
