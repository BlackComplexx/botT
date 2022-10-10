const rp = require('request-promise');
const axios = require('axios');
const crypto = require('crypto')

//Abrir orden market
var OpenOrden = async function (options = {}){
let BinanceKey = options.keyDefault;
let BinanceKeyPrivate = options.keyPrivate;

let vr1 = options.vr1; //Simbolo (DAI/USDT)
let vr2 = options.vr2; //Tipo (BUY , SELL)
let vr3 = options.vr3; //Cantidad usdt

let query = 'recvWindow=5000&timestamp='+(new Date().getTime()) + "&symbol="+vr1+"&side="+vr2+"&quantity="+vr3+"&type=market";
    const signature = crypto.createHmac('sha256', BinanceKeyPrivate).update(query).digest("hex");
    query += '&signature='+signature;
    
    return await axios({
        'method': 'POST',
        'url': 'https://api.binance.com/api/v3/order?'+query,
        'headers': {
            'X-MBX-APIKEY': BinanceKey
        }
    }).then(parsedBody => {
        //console.log(parsedBody)
        return `{ response: "done" }`;
      })
      .catch(function (error) {
        //  console.log(error)
        return `{ response_fail: "${error.response.data.msg}" }`;
      })
}

module.exports = {OpenOrden: OpenOrden}