//Crea log en la base de datos
require('../config/mongoose');
const { Schema, model } = require('mongoose');

const Datos = new Schema({
    nameCoin: {
        type: String
    },

    Day: {
        type: Schema.Types.Mixed
    },

    Balance: {
        type: Number
    },

    EntryPrecio: {
        type: Number
    },

    Percentage: {
        type: Number
    },

    Completed: {
        type: Boolean
    }
  });

  module.exports = model('Datos De Trading ', Datos);