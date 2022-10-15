const { check } = require('express-validator');
const express = require('express');

const { emailExist } = require('../helpers/db-validators')

const { login } = require('../controllers/auth.controllers');

const router = express.Router();


router.post('/login', [
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('correo').custom(correo => emailExist(correo)),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
], login);




module.exports = router;
