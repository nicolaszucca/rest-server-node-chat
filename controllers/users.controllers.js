const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/user');


//Get
const usersGet = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .limit(limit)
            .skip(from)
    ])

    res.json({
        total,
        usuarios
    })
}

//Post
const usersPost = async (req = request, res = response) => {


    //El "Usuario" proviene de la instancia creada en models/user
    //por lo tanto también es un esquema (Schema). O sea que contiene los ID automaticos de mongoose
    const { nombre, correo, password, rol } = req.body;
    const user = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contraseña (hash)
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    //Guardar en DB
    await user.save();

    //Response
    res.json({
        user
    })
}

//Put
const usersPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar contra DB
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuario)
}

//Patch
const usersPatch = (req = request, res = response) => {
    res.json({
        'msg': 'Patch API - Controller',
    })
}

//Delete
const usersDelete = async (req = request, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario)
}








module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}

