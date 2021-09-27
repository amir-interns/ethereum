
var Web3 = require('web3')
const web3 = new Web3("https://ropsten.infura.io/v3/672b38a3e2d746f5bd5f24396cb048e9");


var address = '0x8e3bF7AD94a541E7C7b1edc4fd07910AB0F12a59';
var coinCount = 100000000000000;

var addrSender='0x7cE1A7273Dc87f08fE85c9652A1f5bCD1Ed66D3B';
var validAdd=web3.utils.isAddress(address);

const wscat=require('ws');


var rawTx = {

      gasPrice: 1600000015,
      gasLimit: 21000,
      to: address,
      from: addrSender,
      value: coinCount,
      chainId: 3
}



if (validAdd!=true){
    console.log("Wrong address!");

}
else{
    var bal=web3.eth.getBalance(addrSender).then((value)=>{
        value=parseInt(value)
        if (value >= parseInt(rawTx.gasPrice)*parseInt(rawTx.gasLimit)+parseInt(rawTx.value)){
            sendTrans()
        }
        else {
            console.log("No money");
        }
    })
}


async function sendTrans(){

    promit=web3.eth.accounts.signTransaction(rawTx, '0xdb9dfc6391e28d274cfd465074e388705be20db4fbf2fc2f4808c8c9e69e58c8').then((signedTx) => {
        web3.eth.sendSignedTransaction( signedTx.rawTransaction ,function(err, hash) {
          if (!err) {
             setTimeout(checkTr, 20000, hash)
          }
          else {
            console.log(err);
          }
        });
    })


}

//checkTr('0x5ed3711cad30446cdf52123dfb5bf77aa7625c4bb6d48c92351da137e25f9b38')

function checkTr(blhash){
    var valueBl=0
    const socket=new wscat ('wss://ropsten.infura.io/ws/v3/672b38a3e2d746f5bd5f24396cb048e9')
        //request_data ='{ "jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1}'
    request_data =' {"jsonrpc":"2.0", "id": 1, "method": "eth_subscribe", "params": ["newHeads"]}'

    var res=web3.eth.getTransactionReceipt(blhash).then((value)=>{
        var valTr=parseInt(value.blockNumber)
        socket.on("open", function open() {
            socket.send(request_data);
    });

       socket.on("message", function incoming(message) {
            var mes=JSON.parse(message)
            var params=mes['params']
            console.log(valTr)
            try{
               valueBl=params['result']['number']

                val_current_bl=parseInt(valueBl,16)
                console.log(val_current_bl, valTr )
                console.log(val_current_bl-valTr )
                if (val_current_bl-valTr >= 3) {
                    console.log("Success!")
                }
            }
            catch{
                console.log('Идет проверка...')
            }
            });

    })
}













