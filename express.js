const express = require("express")
var Web3 = require('web3')
const web3 = new Web3("https://mainnet.infura.io/v3/672b38a3e2d746f5bd5f24396cb048e9")
const abi=require('./abicontract.json')

const app = express()
var ether=0
var usdt=0

//С формой
const urlencodedParser = express.urlencoded({extended: false});

async function getUsdt(address){
    const contr = new web3.eth.Contract(abi,'0xdAC17F958D2ee523a2206206994597C13D831ec7');
    value=await contr.methods.balanceOf(address).call()
    return value
}



async function getEther(address){
    var etherbal=await web3.eth.getBalance(address)
    var ether= web3.utils.fromWei(etherbal,'ether')
    return ether
}




app.get("/form", function (request, response) {
    response.sendFile(__dirname + "/balance.html");
});
app.post("/form", urlencodedParser, function (request, response) {
    fun=async()=>{var ether=await getEther(request.body.address)
        var usdt =await getUsdt(request.body.address)
        var balance={
            usdt:usdt,
            ether:ether
        }
        response.status('200').send(balance)
    }
    fun()
});


//Через url
app.use((request, response, next)=>{
    web3.eth.getBalance(request.query.address).then((value)=>{
        ether=web3.utils.fromWei(value,'ether')
        next()
    })
})

app.use((request, response, next)=>{
    const contr = new web3.eth.Contract(abi,'0xdAC17F958D2ee523a2206206994597C13D831ec7');
    contr.methods.balanceOf(request.query.address).call().then((value)=>{
        usdt=value
        next()
    })

})

app.get("/",(request, response)=>{

    var balance={
        usdt:usdt,
        ether:ether}
    response.status('200').send(balance)
})


app.listen(3000)





