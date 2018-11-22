const axios = require('axios').default;

class Api {
  constructor(email, password, order) {
    this.appServer = 'http://13.125.236.184';
    this.clientId = 1;
    this.clientSecret = 'ZyukJCTBiOdb5j96ahz86mcy2USDFtZoSfRYs1oR';
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
    await axios.post(url, this.order, config).then(res => {
      console.log('order success', res.data);
    }).catch(err => {
      console.log(err.message);
    });
  }
}

module.exports = Api;
