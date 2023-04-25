const express = require('express');
const { check } = require('express-validator');


// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRol, tieneRol } = require('../middlewares/validar-rol');
//Forma para importar todo de forma resumida y codeClean:
const { validarJWT, validarCampos, esAdminRol, tieneRol } = require('../middlewares');

const { isValidRole, emailExist, existUserById } = require('../helpers/db-validators')

const { usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete } = require('../controllers/users.controllers');



const router = express.Router();


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

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(id => existUserById(id)),
    check('rol').custom(rol => isValidRole(rol)),
    validarCampos
], usersPut)

router.patch('/', usersPatch)

router.delete('/:id', [
    validarJWT,
    // esAdminRol,
    tieneRol("ADMIN_ROLE"),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(id => existUserById(id)),
    validarCampos
], usersDelete)


module.exports = router;