/*
Ejercicio de desarrollo de una web con Express, sobre la base de datos
de "libros" utilizada en sesiones anteriores. Se definirán distintas
vistas en Nunjucks para mostrar información de los libros y poderlos
insertar, borrar, etc.

Se añade un mecanismo de autenticación basada en sesiones para proteger el
acceso a las zonas de modificación de libros (alta, borrado y modificación)
*/

// Carga de librerías
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

// Enrutadores
const libros = require(__dirname + '/routes/libros');
const autores = require(__dirname + '/routes/autores');

// Simulamos así la base de datos de usuarios registrados
const usuarios = [
    { usuario: 'nacho', password: '12345' },
    { usuario: 'pepe', password: 'pepe111' }
];

// Conectar con BD en Mongo 
mongoose.connect('mongodb://localhost:27017/libros', 
    {useNewUrlParser: true});

// Inicializar Express
let app = express();

// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Configuración de la sesión en la aplicación
// Es importante poner este middleware ANTES de cargar
// los enrutadores con app.use, para que éstos tengan
// esta configuración aplicada
app.use(session({
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

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
// Cargamos ahora también la carpeta "public" para el CSS propio
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/libros', libros);
app.use('/autores', autores) // Para la parte opcional

// Vista de login
app.get('/login', (req, res) => {
    res.render('login');
});

// Proceso de login (obtener credenciales y cotejar)
app.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    let existeUsuario = usuarios.filter(usuario => usuario.usuario == login && usuario.password == password);
    if (existeUsuario.length > 0)
    {
        req.session.usuario = existeUsuario[0].usuario;
        req.session.rol = existeUsuario[0].rol;
        res.redirect('/libros');
    } else {
        res.render('login', {error: "Usuario o contraseña incorrectos"});
    }
});

// Ruta para logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/libros');
});

// Puesta en marcha del servidor
app.listen(8080);