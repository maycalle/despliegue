/** Definición del esquema y modelo de la colección
 *  usuarios registrados */

const mongoose = require('mongoose');

/** Esquema de los usuarios registrados */
let usuarioSchema = new mongoose.Schema ({
    login: {
        type: String,
        minlength: 5,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
    }
});

let Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;