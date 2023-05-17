const dbValidators = require('./db-validators');
const googleSignIn = require('./googleSignIn-validator');
const generarJwt = require('./jwt');
const subirArchivo = require('./subir-archivo');


module.exports = {
    ...dbValidators,
    ...googleSignIn,
    ...generarJwt,
    ...subirArchivo,
}