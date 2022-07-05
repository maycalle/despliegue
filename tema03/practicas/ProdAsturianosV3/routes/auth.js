const express = require('express');
const SHA256 = require('crypto-js/sha256');
let Usuario = require(__dirname + '/../models/usuario.js');
let router = express.Router();

// Vista de login
router.get('/login', (req, res) => {
    res.render('auth_login');
});

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = SHA256(req.body.password);
    
    Usuario.find({login: login}).then( resultado => {
        if ( resultado.length > 0 ) {
            if (resultado[0].password == password)
            {
                req.session.usuario = resultado[0].login;                
                res.redirect('/productos');
            }
            else
                res.render('auth_login', {error: 'Password incorrecto'});
        }
        else{
            res.render('auth_login', {error: 'Login incorrecto'});
        }
    }).catch(error => {
        res.render('auth_login');
    });    
});

// Ruta para logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;