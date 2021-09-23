
var Web3 = require('web3')
const web3 = new Web3("https://ropsten.infura.io/v3/672b38a3e2d746f5bd5f24396cb048e9");


var address = '0x8e3bF7AD94a541E7C7b1edc4fd07910AB0F12a59';
var coin_count = 100000000000000;

var addr_sender='0x7cE1A7273Dc87f08fE85c9652A1f5bCD1Ed66D3B';
var valid_add=web3.utils.isAddress(address);

var rawTx = {

      gasPrice: 1500000015,
      gasLimit: 21000,
      to: address,
      from: addr_sender,
      value: coin_count,
      chainId: 3
}



if (valid_add!=true){
    console.log("Wrong address!");

}
    else{
        var bal=web3.eth.getBalance(addr_sender).then((value)=>{
        value=parseInt(value)
        if (value >= parseInt(rawTx.gasPrice)*parseInt(rawTx.gasLimit)+parseInt(rawTx.value)){
            sendTrans()
            }
        else {
            console.log("No money");
        }
        })
        }


function sendTrans(){

    promit=web3.eth.accounts.signTransaction(rawTx, '0xdb9dfc6391e28d274cfd465074e388705be20db4fbf2fc2f4808c8c9e69e58c8').then((signedTx) => {
        web3.eth.sendSignedTransaction( signedTx.rawTransaction ,function(err, hash) {
          if (!err) {


               for (let i=0; i<750; i++){
                    console.log(setInterval(checkTr, 1000, hash))
                    setInterval(checkTr, 1000, hash)==1)



               }


          } else {
            console.log(err);
          }
        });

    })

}



function checkTr(blhash){

    web3.eth.getTransaction(blhash).then((value)=>{

            web3.eth.getBlockNumber().then((valueBl)=>{

                valTr=parseInt(value.blockNumber)
                val_current_bl=parseInt(valueBl)

                if (val_current_bl-valTr >= 3) {
                    console.log("Success!")

                    return 1
                }





            })

    })
}







