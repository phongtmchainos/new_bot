const axios = require('axios').default;
var random = require("random-js")();

class Api {
  constructor(email, password, order) {
    this.appServer = 'http://3.1.27.64/';
    this.clientId = 2;
    this.clientSecret = 'j2ZccqD1G2BArGYMzbgyO8D4RY3KBYmteXpbeKPj';
    this.email = email;
    this.password = password;
    this.order = order;
    this.minQuantities = {
      btc: 0.0001,
      eth: 0.001,
      bch: 0.001,
      xrp: 1,
      ltc: 0.001,
      etc: 0.001,
      dash: 0.0001,
      neo: 0.0005,
      qtum: 0.00005
    };
    this.run();
  }

  async run() {
    this.accessToken = await this._getAccessToken();
    await this._createOrder();
  }

  async _getAccessToken() {
    try {
      let fullUrl = `${this.appServer}/oauth/token`;
      let config = {
        grant_type: 'password',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: '',
        username: this.email,
        password: this.password
      };
      let data = await axios.post(fullUrl, config);
      return await data.data.access_token;
    } catch (e) {
      console.log(e.message);
    }
  }

  async _createOrder() {
    let url = `${this.appServer}/api/v1/orders`;
    let config = {
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + this.accessToken
      }
    };
    let orderInfo = await this.orderInfo(this.order.trade_type, this.order.coin);
    await axios.post(url, Object.assign(this.order, orderInfo), config).then(res => {
      console.log(this.order);
    }).catch(err => {
      console.log(err.message);
    });
  }

  async orderInfo(tradeType, coin) {
    let url = ` https://api.bithumb.com/public/orderbook/${coin}`;
    let res = await axios.get(url);
    let data = [];
    if (tradeType === 'buy') {
      data = res.data.data.bids;
    } else {
      data = res.data.data.asks;
    }
    return {
      price: data[random.integer(0, data.length - 1)].price,
      quantity: this.calulateQuantity(data[random.integer(0, data.length - 1)].quantity, coin)
    };
  }

  calulateQuantity(amount, coin) {
    let minQuantity = this.minQuantities[coin] || 0.1;
    let quantity = amount;
    if (quantity > 200 * minQuantity) {
      quantity = quantity / 200;
    }
    quantity = Math.round(quantity / minQuantity) * minQuantity;
    return Math.max(quantity, minQuantity);
  }
}

module.exports = Api;
