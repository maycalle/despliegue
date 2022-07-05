const express = require('express');

let Producto = require(__dirname + '/../models/producto.js');

let router = express.Router();

// Listado de productos
router.get( '/', (req, res) => {
    Producto.find().then( resultado => {
        res.status(200)
           .send({ok:true, resultado: resultado});
    }).catch(error => {
        res.status(500)
           .send({ok:false, error:"No se encontraron productos"});
    });
});

// Ficha de un producto 
router.get('/:id', (req, res) => {
    Producto.findByIdAndUpdate(req.params['id']).then(resultado => {
        if(resultado)
            res.status(200)
               .send({ok:true, resultado: resultado});
        else
            res.status(400)
               .send({ok:false, error: "Producto no encontrado"});
   }).catch(error => {
       res.status(500)
          .send({ok:false, error: "Error obteniendo los productos"})
   })
});

// Añadir productos
router.post('/', (req, res) => {
    let nuevoProducto = new Producto ({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion        
    });

    if (req.body.imagen)
        nuevoProducto.imagen = req.body.imagen;
    
    nuevoProducto.save().then( resultado => {
        res.status(200)
            .send({ok: true, resultado: resultado});
    }).catch( error => {
        res.status(400)
           .send({ok: false, error: "Error insertando el producto"})
    });
});

// Modificar un producto
router.put('/:id', (req, res) => {
    Producto.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripción: req.body.descripcion
        }
    }, {new: true}).then( resultado => {
        if (resultado) 
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(400)
               .send({ok: false, error: "Producto no encontrado"})
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: "Error actualizando el producto"});
    });
});

// Añadir un comentario
router.post('/comentarios/:idProducto', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if ( resultado ) 
        {
            let nuevoComentario=resultado;
            nuevoComentario.comentarios.push(
                {usuario: req.body.nombre,
                comentario: req.body.comentario}
            );
            
            nuevoComentario.save().then(resultado_actualizado => {
                res.status(200)
                   .send({ok: true, resultado: resultado_actualizado });
            }).catch(error => {        
                res.status(400)
                    .send({ok:false, error: "Error modificando los comentarios del producto" });                
            });
        }
    }).catch (error => {
        res.status(400)
            .send({ok: false, error: "Error insertando el comentario"});
    });
});

//Borrar comentario
router.delete('/comentarios/:idProd/:idComment', (req,res) => {
    Producto.findById(req.params.idProd).then(producto => {
        producto.comentarios = producto.comentarios.filter(comentario => comentario._id != req.params.idComment);
       
        producto.save().then(resultado => {
            res.status(200)
            .send({ok: true, resultado:prodcuto });
        }).catch( error =>{
            res.status(400)
                .send({ok: false, error:"Error eliminando el comentario del producto"});
        })

    }).catch(error => {
        res.status(400)
        .send({ok:false, error: "Comentario no encontrado"});
    });
});

// Borrar un producto
router.delete('/:id', (req, res) => {
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

module.exports = router;

