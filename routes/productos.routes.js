const express = require('express');
const { check, oneOf, body } = require('express-validator');

const { obtenerProductos,
    obtenerProducto,
    crearProducto,
    modificarProducto,
    eliminarProducto } = require('../controllers/productos.controllers');

const { existeCategoria, existeProducto } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRol } = require('../middlewares');



const router = express.Router();

/*
*  {{url}}/api/productos  
*/


//get
router.get('/', obtenerProductos)

//get by id
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => existeProducto(id)),
    validarCampos
], obtenerProducto)

//create producto
router.post('/', [
    validarJWT,
    esAdminRol,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(id => existeProducto(id)),
    oneOf([
        body('nombre').notEmpty().toUpperCase(),
        body('categoria').notEmpty().custom(cat => existeCategoria(cat)),
        body('precio').notEmpty()],
        'Se requiere al menos un campo para modificar'),
    validarCampos
], modificarProducto)

router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(id => existeProducto(id)),
], eliminarProducto)



module.exports = router;