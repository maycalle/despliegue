/** Definición del esquema y modelo de la colección
 *  de productos asturianos */

 const mongoose = require('mongoose');

/** Esquema de los comentarios de un producto */ 
 let comentarioSchema = new mongoose.Schema ({
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

 /** Esquema de los productos asturianos */
let productoSchema = new mongoose.Schema ({
    nombre: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        required: false
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