const { request, response } = require('express');

const Producto = require('../models/producto')


const obtenerProductos = async (req, res = response) => {

    const { from, limit } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments(),
        Producto.find({ estado: true })
            .skip(from)
            .limit(limit)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])

    res.status(200).json({
        total,
        productos
    })
}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario')
        .populate('categoria');


    res.status(200).json(producto)

}

const crearProducto = async (req, res = response) => {
    const user = req.usuario;//Existe y esta en true

    const { estado, usuario, ...body } = req.body;

    const productoExist = await Producto.findOne({ nombre: body.nombre });

    if (productoExist) {
        return res.status(400).json({
            msg: `El producto: ${body.name} ya existe`
        })
    }


    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        estado: true,
        usuario: user.id,
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json({
        msg: "Prodcuto creado"
    })
}

const modificarProducto = async (req, res = response) => {

    const user = req.usuario;
    const { id } = req.params;
    const { estado, usuario, ...body } = req.body;


    const producto = await Producto.findByIdAndUpdate(id, { usuario: user.id, ...body },
        { new: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.status(200).json(producto)
}

const eliminarProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');


    res.status(200).json(producto)
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    modificarProducto,
    eliminarProducto,
}