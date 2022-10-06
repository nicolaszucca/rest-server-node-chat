const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isValidRole, emailExist } = require('../helpers/db-validators')
const router = express.Router();


const { usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete } = require('../controllers/users.controllers')



router.get('/', usersGet)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe contener mas de 6 digitos').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(correo => emailExist(correo)),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(rol => isValidRole(rol)),
    validarCampos
], usersPost)

router.put('/:id', usersPut)

router.patch('/', usersPatch)

router.delete('/', usersDelete)


module.exports = router;