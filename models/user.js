const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: String,
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
})

//Quitar parametros de la response:
/* UsuarioSchema.methods.toJSON = function () {
    const { password, __v, user} = this.toObject();
    return user
} */


module.exports = model('Usuario', UsuarioSchema);
