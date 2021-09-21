
let address = process.argv[2];
let coin_count = process.argv[3];

var Web3 = require('web3')

const web3 = new Web3("https://ropsten.infura.io/v3/048e165d14a0442e9246d396f95bc2fb");

var rawTx = {

  gasPrice: 70,
  gasLimit: 51000,
  to: address,
  from:'0x7cE1A7273Dc87f08fE85c9652A1f5bCD1Ed66D3B',
  value: coin_count,
  chainId: 3
}



web3.eth.accounts.signTransaction(rawTx, '0xdb9dfc6391e28d274cfd465074e388705be20db4fbf2fc2f4808c8c9e69e58c8').then((signedTx) => {

    web3.eth.sendSignedTransaction( signedTx.rawTransaction ,function(err, hash) {
      if (!err) {
        console.log( signedTx.rawTransaction );
      } else {
        console.log(err);
      }
    });

})



