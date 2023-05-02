const { request, response } = require('express');
const Categoria = require('../models/categoria');

//get categories
const obtenerCategorias = async (req = request, res = response) => {
    const { from = 0, limit = 5 } = req.query;


    const [cantidad, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
            .skip(from)
            .limit(limit)
            .populate('usuario', 'nombre')
    ])

    res.status(200).json({
        "Total": cantidad,
        categorias
    })

}

//get categorie
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id)
        .populate('usuario');


    res.status(200).json(categoria)
}

//create categorie
const crearCategoria = async (req = request, res = response) => {
    //usuario autenticado con el token
    const user = req.usuario;
    //nombre de la categoria
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria '${categoriaDB.nombre}' ya existe`
        })
    }

    const data = {
        nombre: nombre,
        estado: true,
        usuario: user._id
    }

    const categoria = new Categoria(data)
    await categoria.save();



    res.status(200).json({
        msg: "Categoria creada con exito",
        categoria
    })
}

//modify categorie
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const user = req.usuario.id;

    const categoriaActulizada = await Categoria.findByIdAndUpdate(id, { nombre: nombre, usuario: user }, { new: true })
        .populate('usuario');


    res.status(200).json({
        msg: "Categoria actualizada con exito",
        categoriaActulizada
    })

}

//delete categories 
const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
        .populate('usuario');



    res.status(200).json({
        msg: "Categoria eleiminada",
        categoriaBorrada
    })

}




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}