/* Rutas públicas */

const express = require('express');

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

// Página de inicio
router.get( '/', (req, res) => {
    res.render('publico_index');   
});

// Buscar productos
router.post('/buscar', (req, res) => {
    let texto=req.body.textoBusquedaProd;
    Producto.find({nombre: new RegExp(texto)}).then(resultado => {
        if (resultado.length > 0)
            res.render('publico_index', {productos: resultado});
        else
            res.render('publico_error', {error: "No se encontraron productos"});
    }).catch(error => {
        res.render('publico_error');
    });
});

// Ficha del producto
router.get('/producto/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('publico_producto', { producto: resultado});
        else    
            res.render('publico_error', {error: "Producto no encontrado"});
    }).catch (error => {
        res.render('publico_error');
    }); 
});

//Añadir comentario
router.post('/comentar/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if ( resultado ) 
        {
            let nuevoComentario=resultado;
            nuevoComentario.comentarios.push(
                {usuario: req.body.nombre,
                comentario: req.body.comentario}
            );
            
            nuevoComentario.save().then(resultado_actualizado => {
                res.render('publico_producto', {producto: resultado_actualizado} );
            }).catch(error => {        
                res.render('publico_error', {error: "Error insertando comentario"});
            });
        }
    }).catch (error => {
        res.render('publico_error');
    });
});

module.exports = router;