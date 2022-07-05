/* Rutas protegidas */

const express = require('express');
const multer = require('multer');

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

/* Configuración de los parámetros de subida y almacenamiento
de archivos */
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

let upload = multer({storage: storage});

// Middleware que se aplicará para autenticar usuarios en rutas protegidas
let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.render('auth_login');
};

// Listado de productos
router.get( '/', autenticacion, (req, res) => {
    Producto.find().then( resultado => {
        res.render('admin_productos', {productos: resultado});
    }).catch(error => {
        res.render('admin_error');
    });
});

// Formulario de nuevo producto
router.get('/nuevo', autenticacion, (req, res) => {
    res.render('admin_productos_form');
});

// Formulario de edición del producto
router.get('/editar/:id', autenticacion, (req, res) => {
    Producto.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('admin_productos_form', {producto: resultado});
        } else {
            res.render('admin_error', {error: "Producto no encontrado"});
        }
    }).catch(error => {
        res.render('admin_error', {error: "Error buscando el producto"});
    });
});

// Ficha de producto
router.get('/:id', autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('admin_productos_ficha', { producto: resultado});
        else    
            res.render('admin_error', {error: "Producto no encontrado"});
    }).catch (error => {
    }); 
});

// Insertar producto
router.post('/', autenticacion, upload.single('imagen'), (req, res) => {
    let nuevoProducto = new Producto({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio        
    });
    if (req.file.filename) 
    {
        nuevoProducto.imagen = req.file.filename;  
    }
    nuevoProducto.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {        
        res.render('admin_error', {error: "Error insertando producto"});
    });
});

// Editar producto
router.post('/:id', autenticacion, upload.single('imagen'), (req, res) => {
    let producto = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio                            
    };    
    if (req.file.filename) 
    {
        producto.imagen = req.file.filename;  
    }
    Producto.findByIdAndUpdate(req.params.id, {
        $set: producto
        }, {new: true}).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error', {error: "Error modificando producto"});
        });            
});

// Borrar un producto
router.delete('/:id', autenticacion, (req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error', {error: "Error borrando producto"});
    });
});

//Formulario para añadir comentarios
router.get('/comentar', autenticacion, (req, res) => {
    res.render('publico_comentarios_form');
});

//Borrar comentario
router.delete('/comentarios/:idProd/:idComment', autenticacion, (req,res) => {
    Producto.findById(req.params.idProd).then(producto => {
        producto.comentarios = producto.comentarios.filter(comentario => comentario._id != req.params.idComment);
       
        producto.save().then(resultado => {
            res.render('admin_productos_ficha',{producto: resultado});
        }).catch( error =>{
            res.render('admin_error', {error: "Error borrando comentario"})
        })

    }).catch(error => {
        res.render('admin_error', {error: "Comentario no encontrado"});
    });
});

module.exports = router;