const { response, request } = require('express');


//Get
const usersGet = (req = request, res = response) => {

    const { q, nombre, ApiKey, limit, page = 1 } = req.query;
    res.json({
        'msg': 'Get API - Controller',
        q,
        limit,
        nombre,
        page
    })
}

//Post
const usersPost = (req = request, res = response) => {

    const { nombre, edad, signo, id } = req.body;

    res.json({
        'msg': 'Post API - Controller',
        nombre,
        edad,
        signo,
        id
    })
}

//Put
const usersPut = (req = request, res = response) => {

    const id = req.params.id;

    res.json({
        'msg': 'Put API - Controller',
        id
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

