const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRol = require('../middlewares/validar-rol');
const validarArchivo = require('../middlewares/validar-files')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRol,
    ...validarArchivo
}