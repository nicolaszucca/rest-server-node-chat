const express = require('express');
const { request, response } = require('express');
const { check } = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categories.controllers');
const { validarCampos, validarJWT, esAdminRol } = require('../middlewares');
const { existeCategoria } = require('../helpers/db-validators');


const router = express.Router();

/*
localhost:8080/api/categories
*/

//get de categorias - publico
router.get('/', obtenerCategorias)

//get by id - publico
router.get('/:id', [
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(id => existeCategoria(id)),
    validarCampos
], obtenerCategoria)

//post - privado, se necesita autorizacion (token)
router.post('/', [
    validarJWT,
    check('nombre', 'Debes ingresar un nombre para la categoria').notEmpty(),
    validarCampos
], crearCategoria)

//put - privado, se necesita token
router.put('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(id => existeCategoria(id)),
    check('nombre', 'Se necesita el nombre para actualizar').notEmpty(),
    validarCampos,
], actualizarCategoria)

//delete - privado, se necesita token
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(id => existeCategoria(id)),
    validarCampos
], borrarCategoria)




module.exports = router;