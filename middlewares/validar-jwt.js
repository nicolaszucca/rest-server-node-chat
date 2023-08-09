const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({ msg: 'No hay token' });
    }


    try {

        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await Usuario.findById(id);

        if (!user) {
            return res.status(401).json({
                msg: 'El usuario no existe en DB'
            })
        }

        if (!user.estado) {
            return res.status(401).json({
                msg: 'Estado = false'
            })
        }

        req.usuario = user
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });

    }

}

const comprobarJWT = async (token = '') => {
    try {

        if (!token) { return null; }
        if (token.length < 10) { return null; }

        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await Usuario.findById(id);

        if (!user) { return null }
        if (!user.estado) { return null }

        return user

    } catch (error) {
        console.error(error)
        return null
    }
}



module.exports = {
    validarJWT,
    comprobarJWT,
}