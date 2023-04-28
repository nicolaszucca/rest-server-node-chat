const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/user');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/googleSignIn-validator');


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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, correo, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: '*****',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }


        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })


    } catch (error) {
        res.status(400).json({
            msg: 'Token invalido',
        })
    }


}




module.exports = {
    login,
    googleSignIn,
}