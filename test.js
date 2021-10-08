const axios = require ( "axios" );
const bitcore = require ( "bitcore-lib" )
express=require('express')
const app = express()
const recieverAddress='mtCqxTJeRheZyktuwqLKQcDgUxZaXwGgU7'
const privateKey = '92VA8uM6vejMw7t6UrBjbh2BCKt7ozZYfDM6xk46QpmrCFE5Kdw'
const sourceAddress = 'miHRnZmA9BzwRQyAyDvQnCkx93JvLUSoXb'
//const amountToSend=0.0001


app.get("/",(request, response)=>{
    response.status('200').send('Hi')
    jsonData=JSON.parse(request.query.data)
    verificTrans(jsonData.transfers)
})






const verificTrans = async (transactions) => {
  let amountToSend=0
  let satoshiToSend=[]
  transactions.forEach(async (el)=>{
    amountToSend+=parseFloat(el.value)

    if (!(isNaN(amountToSend))){
      satoshiToSend.push(parseInt(amountToSend * 100000000))
    }

    let fee = 0
    let inputCount = 0
    let outputCount = 2 *  transactions.length     //transactions.indexOf(el)
    let totalAmountAvailable = 0
    let inputs = []

    const utxos = await axios.get(
      `https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${sourceAddress}`
    );
  let utxo = {}
  utxos.data.data.txs.forEach(async (element) => {
      utxo.satoshis = Math.floor(Number(element.value) * 100000000)
      utxo.script = element.script_hex
      utxo.address = utxos.data.data.address
      utxo.txId = element.txid
      utxo.outputIndex = element.output_no
      totalAmountAvailable += utxo.satoshis
      inputCount += 1
      inputs.push(utxo)
    })

    transactionSize = inputCount * 145 + outputCount * 34 + 10

    fee = transactionSize * 20
//    console.log(totalAmountAvailable - satoshiToSend - fee )
    if ((totalAmountAvailable - satoshiToSend - fee  < 0) && (transactions.indexOf(el)!=0)){
      let newtranslist=transactions.slice(0,transactions.indexOf(el))
//      console.log(newtranslist)
//      console.log(newtranslist, totalAmountAvailable,utxos, utxo, inputs, satoshiToSend, fee)
      sendTrans(newtranslist, totalAmountAvailable, utxos, utxo,inputs, satoshiToSend, fee)


    }
    else{
      if (transactions.indexOf(el)==transactions.length-1){
//        console.log(transactions, totalAmountAvailable,utxos, utxo, inputs, satoshiToSend, fee)
        sendTrans(transactions, totalAmountAvailable,utxos, utxo, inputs, satoshiToSend, fee)

      }
    }
  })
}


const sendTrans = async (data, totalAmountAvailable, utxos, utxo, inputs, satoshiToSend, fee)=>{
  const transaction = new bitcore.Transaction()
  transaction.from(inputs)
//  data.forEach((el)=>{
//    transaction.to(el.to, satoshiToSend[data.indexOf(el)])
//  })
  console.log(data[0].to, satoshiToSend[0])
  transaction.to(data[0].to, satoshiToSend[0])
  transaction.change(sourceAddress)
  transaction.fee(fee)
  transaction.sign(privateKey)

  let serializedTransaction = transaction.serialize()
//  const result = await axios({
//    method: "POST",
//    url: 'https://sochain.com/api/v2/send_tx/BTCTEST',
//    data: {
//      tx_hex: serializedTransaction,
//    },
//  });
//  console.log(result.data.data)
//  return result.data.data

  console.log(serializedTransaction)
};



async function checkWallet(){
    const utxos = await axios.get(`https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${recieverAddress}`);
    console.log(utxos.data.data)
}

//checkWallet()

async function checkWalletSender(){
    const utxos = await axios.get(`https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${sourceAddress}`);
    console.log(utxos.data.data)
}

//checkWalletSender()
app.listen(3000)