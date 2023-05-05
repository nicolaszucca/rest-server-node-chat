const { response } = require("express")
const { ObjectId } = require('mongoose').Types;

const { Categoria, Producto, Usuario } = require('../models/index');
const categoria = require("../models/categoria");
const producto = require("../models/producto");

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'usuarios',
    'xcategoria',
]

const filtrarPorCategoria = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const productos = await Producto.find({ categoria: ObjectId(termino) })
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');
        return res.status(200).json({
            results: (productos) ? [productos] : [],
        })
    }

    //Case sensitive
    const regex = new RegExp(termino, 'i');

    //Array con todos los id de las categorias
    const IdCategorias = await Categoria.find({ nombre: regex, estado: true }, '_id');

    const productos = await Producto.find({ categoria: { $in: IdCategorias }, estado: true, })
        .populate('categoria', 'nombre');


    res.status(200).json({
        results: productos
    })

}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino)
            .populate('usuario', 'nombre');
        return res.status(200).json({
            results: (categoria) ? [categoria] : []
        })
    }

    //Case sensitive
    const regex = new RegExp(termino, 'i');

    //match with name and estado:true
    const categorias = await Categoria.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre');
    res.status(200).json({
        results: categorias
    })
}


const buscarUsuarios = async (termino = '', res = response) => {
    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.status(200).json({
        results: usuarios
    })
}


const buscarProductos = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')

        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    //Case sensitive
    const regex = new RegExp(termino, 'i');

    //match with name and estado:true
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre')

    res.json({ results: productos })
}


const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La coleccion: ${coleccion} no existe`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'xcategoria':
            filtrarPorCategoria(termino, res);
            break;

        default:
            res.status(500).json({
                msg: "Not found"
            })
            break;
    }
}


module.exports = {
    buscar,
}