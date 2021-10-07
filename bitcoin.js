const axios = require ( "axios" );
const bitcore = require ( "bitcore-lib" );
const recieverAddress='miHRnZmA9BzwRQyAyDvQnCkx93JvLUSoXb'
const privateKey = '92VA8uM6vejMw7t6UrBjbh2BCKt7ozZYfDM6xk46QpmrCFE5Kdw'
const sourceAddress = 'mtCqxTJeRheZyktuwqLKQcDgUxZaXwGgU7';
//const amountToSend=0.0001

const main = async ( amountToSend) => {
//  const recieverAddress='miHRnZmA9BzwRQyAyDvQnCkx93JvLUSoXb'
//  const privateKey = '92VA8uM6vejMw7t6UrBjbh2BCKt7ozZYfDM6xk46QpmrCFE5Kdw'
//  const sourceAddress = 'mtCqxTJeRheZyktuwqLKQcDgUxZaXwGgU7';
  const satoshiToSend = amountToSend * 100000000;
  let fee = 0;
  let inputCount = 0;
  let outputCount = 2;

  const utxos = await axios.get(
    `https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${sourceAddress}`
  );
  const transaction = new bitcore.Transaction();
  let totalAmountAvailable = 0;

  let inputs = [];
  utxos.data.data.txs.forEach(async (element) => {
    let utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = utxos.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
  });

  transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;


  fee = transactionSize * 20
  if (totalAmountAvailable - satoshiToSend - fee  < 0) {
    throw new Error("Balance is too low for this transaction");
  }

  //Set transaction input
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(recieverAddress, satoshiToSend);

  // Set change address - Address to receive the left over funds after transfer
  transaction.change(sourceAddress);

  //manually set transaction fees: 20 satoshis per byte
  transaction.fee(fee * 20);

  // Sign transaction with your private key
  transaction.sign(privateKey);
  console.log(transaction)
  console.log('----')

  // serialize Transactions
  const serializedTransaction = transaction.serialize();
  // Send transaction
  console.log(serializedTransaction)
  console.log('----')
  const result = await axios({
    method: "POST",
    url: 'https://sochain.com/api/v2/send_tx/BTCTEST',
    data: {
      tx_hex: serializedTransaction,
    },
  });
  console.log(result.data.data)
  return result.data.data;
};
//main(0.0001)

async function checkWallet(){
    const utxos = await axios.get(`https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${recieverAddress}`);
    console.log(utxos.data.data)
}


//checkWallet()

async function checkWalletSender(){
    const utxos = await axios.get(`https://sochain.com/api/v2/get_tx_unspent/BTCTEST/${sourceAddress}`);
    console.log(utxos.data.data)
}

checkWalletSender()