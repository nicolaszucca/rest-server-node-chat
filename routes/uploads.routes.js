const express = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');
const { coleccionValida } = require('../helpers');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controllers');

const router = express.Router();


router.post('/', [
    validarArchivo,
    validarCampos
], cargarArchivo)

router.put('/:coleccion/:id', [
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('coleccion', 'No es una coleccion válida').custom(c => coleccionValida(c)),
    validarArchivo,
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('coleccion', 'No es una coleccion válida').custom(c => coleccionValida(c)),
    validarCampos
], mostrarImagen)

module.exports = router;