const axios = require('axios').default;

let baseUrl = 'http://13.125.236.184/api';
let clientId = 3;
let clientSecret = 'KQ8LrE3vJZBRfr2WqiOrVMm66bMyAyDesUVrZ3o6';

class Api {
  async getMasterData(){
    let masterData = await axios.get(`${baseUrl}/masterdata`);
    return await masterData;
  }

  async getPriceCoinGecko(currency){
    let data = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`);
    return data;
  }

  async createToken(bot) {
    let defaultParams = {
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      scope: '',
    };
    let params = Object.assign(defaultParams, bot);
    let data = await axios.post(`${baseUrl}/oauth/token`, params);
    return data.data.access_token;
  }

  async createOrder(bot, order) {
    let token = await this.createToken(bot);
    let configs = {
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + token
      }
    };
    console.log(order);
    axios.post(`${baseUrl}/orders`, order, configs).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err.message);
    });
  }
}

module.exports = Api;
