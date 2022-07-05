/* Servidor principal de Express y servicios */

// Librerías externas
const express = require ('express');
const mongoose = require('mongoose');

// Enrutadores
const productos = require (__dirname + '/routes/productos');

// Conexión con la base de datos
mongoose.connect('mongodb://localhost:27017/productos', { useNewUrlParser: true, useUnifiedTopology: true });

let app = express();

//  Carga de middleware y enrutadores
app.use(express.json());
app.use('/productos', productos);

// Puesta en marcha del servidor en el puerto 8080
app.listen(8080);