const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es requerido'],
        unique: true
    },
    estado: {
        type: Boolean,
        defoult: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: [true, 'El usuario es requerido']
    }

})

module.exports = model('Categoria', CategoriaSchema);