var fs = require('fs');
var BotManager = require('./src/BotManager');
var Api = require('./src/Api');

let api = new Api();
api.getMasterData().then(res => {
  fs.writeFile('./src/masterData.json', JSON.stringify(res.data.data), function (err) {
    if (err) console.log(err);
  });
});

let masterData = JSON.parse(fs.readFileSync('./src/masterData.json', 'utf8'));

new BotManager(masterData.coin_settings, masterData.price_groups);
