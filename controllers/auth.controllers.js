const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/user');
const { generarJWT } = require('../helpers/jwt');


const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si existe el email
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ msg: 'Email no exist' });
        };

        //Verificar que el usuario exista en la DB
        if (!usuario.estado) {
            return res.status(400).json({ msg: 'Estado = false' });
        };

        //Verificar la contraseña
        const validPass = bcrypt.compareSync(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({ msg: 'Invalid password' });
        };

        //Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Admin problem'
        });

    }
}




module.exports = {
    login,
}