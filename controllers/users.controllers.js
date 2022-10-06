const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/user');


//Get
const usersGet = (req = request, res = response) => {

    const { q, nombre, limit, page } = req.query;
    res.json({
        'msg': 'Get API - Controller',
        q,
        limit,
        nombre,
        page
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
    const { password, google, correo, ...resto } = req.body;

    //Validar contra DB
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        'msg': 'Put API - Controller',
        usuario
    })
}

//Patch
const usersPatch = (req = request, res = response) => {
    res.json({
        'msg': 'Patch API - Controller',
    })
}

//Delete
const usersDelete = (req = request, res = response) => {
    res.json({
        'msg': 'Delete API - Controller',
    })
}








module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}

