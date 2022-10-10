console.clear();
require('dotenv').config();
require('./config/mongoose');
const color = require('colors');


setInterval(function () {
require('./botConfig/botDetector').LoadModule(option={
    Min: process.env.MIN,
    Max: process.env.MAX,
    Crypto: process.env.Crypto,
    keyDefault: process.env.BINANCEKEY,
    keyPrivate: process.env.BINANCEKEYPRIVATE
});
}, process.env.TIMING);

console.log(color.red('x Bot Trading x'))
console.log(color.cyan(`
Crypto utilizada: ${process.env.Crypto}
USDT utilizados por orden: ${process.env.USDT}
`));

var http = require('http');
http.createServer(function (req, res) {
  
  if (req.url === '/bot'){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(require('./html_bot/html').html());
}
res.end();

}).listen(80);