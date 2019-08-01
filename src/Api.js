const axios = require('axios').default;

class Api {
  constructor(email, password, order) {
    this.appServer = 'http://45.32.102.24';
    this.clientId = 2;
    this.clientSecret = 'ddKlF9b2sBnKPyD70DMXRGPLnGApLcI60b4fhh6p';
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
