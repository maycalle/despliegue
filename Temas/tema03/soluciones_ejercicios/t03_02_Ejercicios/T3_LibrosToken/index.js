/*
Ejercicio de desarrollo de servicios con Express. Sobre la base de datos de "libros" de  
sesiones anteriores, se desarrollarán los servicios básicos paras operaciones habituales de
GET, POST, PUT y DELETE. En este caso, dejamos hechas las operaciones tipo GET.

En esta versión del ejercicio, se estructura el código en carpetas separadas para modelos
y enrutadores

Se añade también un mecanismo de autenticación por token para acceso a las zonas de modificación de libros
*/

// Carga de librerías
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const secreto = require(__dirname + '/secreto.json');

// Simulamos así la base de datos de usuarios registrados
const usuarios = [
    { usuario: 'nacho', password: '12345', rol: 'admin' },
    { usuario: 'pepe', password: 'pepe111', rol: 'normal' }
];

// Enrutadores
const libros = require(__dirname + '/routes/libros');
const autores = require(__dirname + '/routes/autores'); // Para la parte opcional

// Método para generar el token tras login correcto
let generarToken = login => {
    return jwt.sign({login: login}, secreto.secreto, {expiresIn: "2 hours"});
};

// Conectar con BD en Mongo 
mongoose.connect('mongodb://localhost:27017/libros', {useNewUrlParser: true});

// Inicializar Express
let app = express();

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.use(bodyParser.json());
app.use('/libros', libros);
app.use('/autores', autores) // Para la parte opcional

// Método de login
app.post('/login', (req, res) => {
    let usuario = req.body.usuario;
    let password = req.body.password;

    let existeUsuario = usuarios.filter(u => 
        u.usuario == usuario && u.password == password);

    if (existeUsuario.length == 1)
        res.send({ok: true, token: generarToken(existeUsuario[0].usuario)});
    else
        res.send({ok: false});
});

// Puesta en marcha del servidor
app.listen(8080);