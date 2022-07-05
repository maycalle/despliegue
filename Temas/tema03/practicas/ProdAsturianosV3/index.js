/* SERVIDOR PRINCIPAL */

/* Librerías necesarias */
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const session = require('express-session');

/* Enrutadores */
const publico = require(__dirname + '/routes/publico');
const productos = require(__dirname + '/routes/productos');
const usuarios = require(__dirname + '/routes/auth');

/* Conexión a la BD */
mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3', 
                { useNewUrlParser: true, useUnifiedTopology: true }
);

/* Servidor Express */
let app = express();

/* Configuración del motor Nunjucks */
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

/* Asignación del motor de plantillas */ 
app.set('view engine', 'njk');


/* Middleware para habilitar el procesado urlencoded y
poder recoger los datos del formulario */
app.use(express.urlencoded({extended: false}));

/* Middleware permite sobreescribir la propiedad req.method
con un nuevo valor */
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object'
    && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
    }
}));

// Configuración de la sesión en la aplicación
// Es importante poner este middleware ANTES de cargar
// los enrutadores con app.use, para que éstos tengan
// esta configuración aplicada
app.use( session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

// Este middleware se emplea para poder acceder a la sesión desde las vistas
// como una variable "session". Es útil para poder mostrar unos contenidos u
// otros en función de los atributos guardados en la sesión. La utilizaremos
// para mostrar el botón de Login o el de Logout en la vista "base.njk"
// según si el usuario está validado o no.
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

/* Middleware para estilos Bootstrap */
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

/* Middleware para cargar la carpeta public */
app.use('/public', express.static(__dirname + '/public'));

/* Enrutadores para cada tipo de rutas */
app.use('/', publico);
app.use('/productos', productos);
app.use('/usuarios', usuarios);

/* Puesta en marcha del servidor */
app.listen(8080);


