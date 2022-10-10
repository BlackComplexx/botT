require('../config/mongoose');
const LogSaver = require('../models/Productos');
const rp = require('request-promise');
const axios = require('axios');
const alertTelegram = require('../botTelegram/bot');
let openOrden = require('./BotConfig');

let RangoDePrecios_BUY = ["0.05847"]

//https://api.binance.com/api/v3/avgPrice?symbol=

async function PrecioCrypto(Simbol){

return rp({
    url: `https://api.binance.com/api/v3/avgPrice?symbol=${Simbol}`,
    json: true,
    headers: {
        'User-Agent': 'Mozilla/4.0 (compatible; Node Binance API)',
        'Content-type': 'application/x-www-form-urlencoded',
    }
}).then(async parsedBody => {
    return Number(parsedBody.price)
});
}


function limit (string = '', limit = 0) {  
    return string.substring(0, limit)
  }


  async function DetectRunningBuy(){
    const result = await LogSaver.find({nameCoin:process.env.Crypto})
    let string2 = "";
    var convert1 = JSON.stringify(result);
    var ParseJson = JSON.parse(convert1);  
    
    ParseJson.forEach(async(obj) => {
        string2 += obj.nameCoin    
    });

    return string2
}

async function DetectAccomount(){
    const result = await LogSaver.find({nameCoin:process.env.Crypto})
    let string2 = 0;
    var convert1 = JSON.stringify(result);
    var ParseJson = JSON.parse(convert1);  
    
    ParseJson.forEach(async(obj) => {
        string2 += obj.Balance    
    });

    return string2
}

async function DetectPrecieOrden(){
    const result = await LogSaver.find({nameCoin:process.env.Crypto})
    let string2 = 0;
    var convert1 = JSON.stringify(result);
    var ParseJson = JSON.parse(convert1);  
    
    ParseJson.forEach(async(obj) => {
        string2 += obj.EntryPrecio    
    });

    return string2
}

function calculator (Num){
    return (0.50 / 100) * Num
}

function calculatorEspecial (Num){
    return (97 / 100) * Num
}


function CalculatorBalance(x , z){
    return x / z
}

var DetectorTrading = async function(option={}){
    let Min = option.Min;
    let max = option.Max;
    let Crypto = option.Crypto;
    let PrecioCr2ypto = await PrecioCrypto(Crypto)
    const RunningTEST = await DetectRunningBuy();

    /*
    const greeting = limit(PrecioCr2ypto.toString().split('.')[0], 5);
    const replace_ = PrecioCr2ypto.toString().replace(PrecioCr2ypto.toString().split('.')[0], greeting);
    */

    if (RunningTEST == process.env.Crypto){

        let OrdenEntry = await DetectPrecieOrden(); //precio de entrada de la orden
        let DetectPreciePROSENTAJE = await calculator(OrdenEntry);
        let SumaTotal = OrdenEntry+DetectPreciePROSENTAJE
        let aaa = OrdenEntry+DetectPreciePROSENTAJE;
        let Calculator = limit(SumaTotal.toString(), 5)
        let Calculator3 = limit(aaa.toString().split('.')[0], 5)

        //if ( OrdenEntry.toString().match(new RegExp(`([${SumaTotal.toString().split('.')[0]}]).${Calculator3.toString().split('.')[1]}(.*)`)) ){


        if ( OrdenEntry.toString().match(new RegExp(`([${SumaTotal.toString().split('.')[0]}]).(.*)`)) && PrecioCr2ypto.toString().split('.')[0] < OrdenEntry.toString()){
            let Founds = await DetectAccomount();
            let CalculatorBalanc2e = CalculatorBalance(Founds, Number(OrdenEntry));
            let FoundsEnd = calculatorEspecial(CalculatorBalanc2e);
            Response2 = await openOrden.OpenOrden(option={vr1: 'TRXBUSD', vr2: 'SELL', vr3: FoundsEnd,keyDefault: process.env.BINANCEKEY, keyPrivate: process.env.BINANCEKEYPRIVATE})

            if (Response2.includes('response_fail') == true){
                await alertTelegram.BotTelegram(option={
                    coin: Crypto,
                    balance: process.env.USDT,
                    type: 'fail',
                    msg: Response2
                });
            } else {
                await alertTelegram.BotTelegram(option={
                    coin: Crypto,
                    balance: process.env.USDT,
                    end: FoundsEnd,
                    type: 'sell'
                });

                const CompletedReplace = await Product.findOne({Completed: false})
                CompletedReplace.Completed = true
                CompletedReplace.save();

            }
        }

    } else

    if (PrecioCr2ypto.toString() < Min.replace(',', '.') & PrecioCr2ypto.toString() < max.replace(',', '.')){
        return

    } else

if( PrecioCr2ypto.toString().match(new RegExp(`([3])85([0-9])(.*)`)) ){  // TRXBUSD
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);

    //await openOrden.OpenOrden(option={vr1: 'TRXBUSD', vr2: 'BUY', vr3: process.env.USDT,keyDefault: process.env.BINANCEKEY, keyPrivate: process.env.BINANCEKEYPRIVATE})

    var day=new Date();
    const options= {day:'numeric', month:'long',hour:'numeric',minute: 'numeric', year:"numeric", timeZone:"America/Argentina/Mendoza"};
    const timing = day.toLocaleDateString("en-AR", options);

        const DataSaved = new LogSaver({
            nameCoin: Crypto,
            Day: timing,
            Balance: process.env.USDT,
            EntryPrecio: PrecioCr2ypto.toString(),
            Percentage: 1,
            Completed: false
        });

        await DataSaved.save();

        await alertTelegram.BotTelegram(option={
            coin: Crypto,
            balance: process.env.USDT,
            type: 'buy'
        });

        return

    } else {
    }
}

//PrecioCrypto('BTCBUSD')
module.exports = { LoadModule: DetectorTrading }