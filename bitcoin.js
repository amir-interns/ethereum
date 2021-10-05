const Client = require('bitcoin-core');
//const client = new Client({ network: 'regtest' });
const client = new Client({
  ssl: {
    enabled: true,
    strict: false
  }
});
client.getInfo().then((help) => console.log(help));
//const balance = new Client().getBalance('3NQ7YQosKUptih8x9XqMz7vWx4rWhmJ6Kc', 0).then(console.log)
//console.log(client.methods.getaddressinfo)
//client.getBlockByHash('0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206', { extension: 'json' }).then(console.log)