const axios = require('axios').default;
var random = require("random-js")();

class Api {
  constructor(email, password, order) {
    this.appServer = 'http://localhost:8000';
    this.clientId = 3;
    this.clientSecret = 'wrTCVZxB3NtSpcNXLj3dgn54oPDNedt9kGlHu54b';
    this.email = email;
    this.password = password;
    this.order = order;
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
    return data[random.integer(0, data.length - 1)];
  }
}

module.exports = Api;
