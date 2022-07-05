/** Fichero auxiliar que genera unos usuarios de prueba */

const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');
const Usuario = require(__dirname + '/../models/usuario');

mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3', 
                { useNewUrlParser: true, useUnifiedTopology: true }
);

Usuario.collection.drop();

let usu1 = new Usuario ({
    login: 'maycalle',
    password: SHA256("12345678")
});
usu1.save();

let usu2 = new Usuario ({
    login: 'mario',
    password: SHA256("abcdefgh")
});
usu2.save();

