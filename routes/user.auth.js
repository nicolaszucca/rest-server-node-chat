const { check } = require('express-validator');
const express = require('express');

const { emailExist } = require('../helpers/db-validators')

const { login, googleSignIn } = require('../controllers/auth.controllers');
const { validarCampos } = require('../middlewares');

const router = express.Router();


router.post('/login', [
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);




module.exports = router;
