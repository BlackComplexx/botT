const mongoose = require('mongoose');
let UrlAPI = process.env.MongoURL;

mongoose.connect(UrlAPI); // Se conencta a la base de datos


mongoose.connection.on('open', _ => {
    console.log('Base de datos conectada: '+UrlAPI);
})
