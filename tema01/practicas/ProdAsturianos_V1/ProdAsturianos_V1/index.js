/* Servidor principal de Express y servicios */

// Carga del módulo Express
const express = require ('express');

// Carga del fichero de utilidades
const utilidades = require ('./fichero_utils.js');

// Declaración de una constante que almacena el nombre del fichero de datos
const fichero = "productos.json";

// Inicialización de un objeto express
let app = express();

// Incorporamos middleware para procesar peticiones en formato JSON
app.use(express.json());

// Carga de los productos del fichero de datos en un array Javascript
let productos = utilidades.cargarProductos(fichero);

// Servicio GET /productos
app.get( '/productos', (req, res) => {
    if ( productos && productos.length > 0 ) 
    {
        res.status(200)
           .send( {ok: true, resultado: productos} );
    } 
    else 
    {
        res.status(500)
           .send({ok: false, error: "No se encontraron productos"});
    }
});

// Servicio GET /productos/id
app.get('/productos/:id', (req, res) => {
    let resultado = productos.filter (
        producto => producto.id == req.params['id']
    );
    if ( resultado && resultado.length > 0 ) 
    {
        res.status(200)
           .send( {ok: true, resultado: resultado} );
    } 
    else 
    {
        res.status(400)
           .send({ok: false, error: "Producto no encontrado"});
    }
});

// Servicio POST /productos
app.post('/productos', (req, res) => {
    let nuevoProducto = {
        id: req.body.id,
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion
    };
    let existe = productos.filter (
        producto => producto.id == nuevoProducto.id
    );

    if (existe.length == 0) {
        // No existe el producto. Añadimos y enviamos OK
        productos.push(nuevoProducto);
        utilidades.guardarProductos(fichero, productos);
        res.status(200).send({ok: true, resultado:nuevoProducto});
    } else {
        // El producto ya existe. Enviamos error
        res.status(400).send({ok: false, error: 'Producto duplicado'});
    }
});

//Servicio PUT /productos/id
app.put('/productos/:id', (req, res) => {
    let existe = productos.filter(producto => producto.id == req.params['id']);

    if (existe.length > 0) {
        let producto = existe[0];
        producto.nombre = req.body.nombre;
        producto.precio = req.body.precio;
        producto.descripcion = req.body.descripcion;

        utilidades.guardarProductos(fichero, productos);
        res.status(200).send({ ok: true, resultado: producto });
    }
    else {
        res.status(400).send({ ok: false, error: "Producto no encontrado" });
    }
});

//Servicio DELETE /productos/id
app.delete('/productos/:id', (req, res) => {
    let filtrado = productos.filter(producto => producto.id != req.params['id']);
    let producto = productos.filter(producto => producto.id == req.params['id']);
    
    if (filtrado.length != productos.length) {
        // El producto existe. Reemplazamos el array y OK
        productos = filtrado;
        utilidades.guardarProductos(fichero, productos);
        res.status(200).send({ok:true, resultado: producto});
    } else {
        //No se ha filtrado nada. El producto no existe
        res.status(400).send({ok: false, error: "Producto no encontrado"});
    }
});

// Puesta en marcha del servidor en el puerto 8080
app.listen(8080);