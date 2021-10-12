const axios = require ( "axios" );
const bitcore = require ( "bitcore-lib" )
express=require('express')
const app = express()
const recieverAddress='miHRnZmA9BzwRQyAyDvQnCkx93JvLUSoXb'
const privateKey = '92VA8uM6vejMw7t6UrBjbh2BCKt7ozZYfDM6xk46QpmrCFE5Kdw'
const sourceAddress = 'mtCqxTJeRheZyktuwqLKQcDgUxZaXwGgU7'
pgp = require('pg-promise')({
})
cn = {
    host: 'localhost',
    port: 5432,
    database: 'express',
    user: 'ilya',
    password: 'ilya'
},
db = pgp(cn)


app.get("/",(request, response)=>{
    response.status('200').send('Hi')
    jsonData=JSON.parse(request.query.data)
    verificTrans(jsonData.transfers)
})


const urlencodedParser = express.urlencoded({extended: false});   // with form
app.get("/form",  (request, response) =>{
    response.sendFile(__dirname + "/pages/Transaction.html");
});


app.post('/form', urlencodedParser , (request,response)=>{
  let transfers=[]
  request.body.addressReceiver.forEach((ad)=>{
    let transf={'to':ad, 'value':request.body.value[ request.body.addressReceiver.indexOf(ad)]}
    transfers.push(transf)
  })
//  verificTrans(transfers)
})


app.get("/transactions", (request, response) =>{

    db.many('SELECT * FROM public."Transaction"')
    .then(function (data) {
        response.send(data)
    })
    .catch(function (error) {
        console.log("ERROR:", error)
    })
})



const verificTrans = async (transactions) => {
  let amountToSend=0
  let satoshiToSend=[]
  let sumToSend=0
  let totalAmountAvailable=0
  let utxo = {}
  let sumInputValue=0
  let inputCount = 0
  let inputs = []


  const utxos = await axios.get(
      `https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${sourceAddress}`
    );

  utxos.data.data.txs.forEach(async (element) => {
    utxo.satoshis = Math.floor(Number(element.value) * 100000000)
    totalAmountAvailable += utxo.satoshis
})

  transactions.forEach(async (el)=>{
    amountToSend+=parseFloat(el.value)
    if (!(isNaN(amountToSend))){
      sumToSend+=parseFloat(amountToSend* 100000000)
      satoshiToSend.push(parseInt(amountToSend * 100000000))
    }
  })

  let fee = 0
  let outputCount = 2 * transactions.length
  transactionSize = inputCount * 145 + outputCount * 34 + 10
  let rest
  fee = transactionSize * 20
  rest=totalAmountAvailable- sumToSend - fee

//  console.log(rest,totalAmountAvailable,sumToSend , fee)

  if (rest>=0){                                // случай, когда денег хватает на все
    minimizeInputs(transactions, satoshiToSend)

    }
  else{
    for (let el of transactions) {
      let fee = 0
      let outputCount = 2 * (transactions.indexOf(el)+1)
      transactionSize = inputCount * 145 + outputCount * 34 + 10
      let rest
      fee = transactionSize * 20
      rest=totalAmountAvailable- parseFloat(el.value)*100000000  - fee

      if (rest<0){
        let newtranslist=transactions.slice(0,transactions.indexOf(el))
        let newSatoshiToSend=satoshiToSend.slice(0, transactions.indexOf(el))

        minimizeInputs(newtranslist, newSatoshiToSend)
        break
      }
    }

  }
}

const minimizeInputs=async (transactions, satoshiToSend)=>{
  let sumValueSatoshi=0
  let inputs=[]
  let inputCount=0
  let utxo={}
  let sumInputValue=0
  let totalAmountAvailable=0
  satoshiToSend.forEach((tr)=>{
    sumValueSatoshi+=tr
  })
  let fee=0
  let outputCount=2*transactions.length
  const utxos = await axios.get(
      `https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${sourceAddress}`
    );

  for (let element of utxos.data.data.txs) {
    utxo.satoshis = Math.floor(Number(element.value) * 100000000)
    utxo.script = element.script_hex
    utxo.address = utxos.data.data.address
    utxo.txId = element.txid
    utxo.outputIndex = element.output_no
    inputCount += 1
    inputs.push(utxo)
    fee = (inputCount * 145 + outputCount * 34 + 10)*20
    sumInputValue+=parseFloat(element.value)

    if (sumInputValue * 100000000>=sumValueSatoshi+fee){
    sendTrans(transactions, inputs, satoshiToSend, fee)
    break
    }
  }
}


const sendTrans = async (data, inputs, satoshiToSend, fee)=>{
  const transaction = new bitcore.Transaction()
  transaction.from(inputs)
  data.forEach((el)=>{
    transaction.to(el.to, satoshiToSend[data.indexOf(el)])
  })
  transaction.change(sourceAddress)
  transaction.fee(fee)
  transaction.sign(privateKey)
  let serializedTransaction = transaction.serialize()
  console.log(transaction)
  const result = await axios({
    method: "POST",
    url: 'https://sochain.com/api/v2/send_tx/BTCTEST',
    data: {
      tx_hex: serializedTransaction,
    },
  });

  data.forEach((el)=>{
    el.value=parseFloat(el.value)
  })

  data.forEach((el)=>{
    db.none('INSERT INTO  public."Transaction" VALUES (${sourceAddress},${el.to}, ${el.value},  ${hash} )',{
    sourceAddress:sourceAddress,
    el: el,
    hash:result.data.data.txid
    })
    .then(function (data) {
        console.log("SUccess")
    })
    .catch(function (error) {
        console.log("ERROR:", error)
    })
  })

  return result.data.data

}

app.listen(3000)