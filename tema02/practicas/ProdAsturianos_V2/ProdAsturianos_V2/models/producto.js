// Definición del esquema y modelo de nuestra colección de productos

const mongoose = require('mongoose');

// Comentario
let comentarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        require: true
    },
    comentario: {
        type: String,
        required: true,
        minlenght: 5
    }
});

// Producto
let productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: false
    },
    comentarios: [comentarioSchema]    
});

let Producto = mongoose.model('producto', productoSchema);

module.exports = Producto;