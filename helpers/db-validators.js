const Role = require('../models/role');
const Usuario = require('../models/user');
const { Categoria, Producto } = require('../models/index');


const isValidRole = async (rol = '') => {
    const rolExist = await Role.findOne({ rol });
    if (!rolExist) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExist = async (correo) => {
    const userEmailExist = await Usuario.findOne({ correo });
    if (userEmailExist) {
        throw new Error(`El correo ${correo} ya existe`);
    }
}

const existUserById = async (id) => {
    const userExist = await Usuario.findById(id);
    if (!userExist) {
        throw new Error(`El id: ${id} no existe`);
    }
}

//Categorias
const existeCategoria = async (id) => {
    const categorieExist = await Categoria.findById(id);

    if (!categorieExist) {
        throw new Error(`La categoria con id: ${id} no existe`);
    }

    if (!categorieExist.estado) {
        throw new Error(`La categoria ha sido deshabilitada`);
    }
}

//Productos
const existeProducto = async (id) => {
    const categorieExist = await Producto.findById(id);

    if (!categorieExist) {
        throw new Error(`El producto con id: ${id} no existe`);
    }

    if (!categorieExist.estado) {
        throw new Error(`El producto ha sido deshabilitado`);
    }
}

//validar colecciones permitidas
const coleccionValida = async (collection) => {
    const collections = ['usuarios', 'productos'];

    if (!collections.includes(collection)) {
        throw new Error(`La coleccion: ${collection} no existe`);
    }

    return true
}

module.exports = {
    isValidRole,
    emailExist,
    existUserById,
    existeCategoria,
    existeProducto,
    coleccionValida,
}
