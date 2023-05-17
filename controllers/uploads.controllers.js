const path = require('path');
const fs = require('fs');

const { response } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models')


const cargarArchivo = async (req, res = response) => {

    try {
        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs')
        return res.status(200).json({ nombre: nombreArchivo })

    } catch (error) {
        return res.status(400).json({ error: error })
    }

}



const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let nameTemp;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con id: ${id}` })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con id: ${id}` })
            }
            break;

        default:
            return res.status(500).json({ msg: 'not found' })
    }

    if (modelo.img) {
        nameTemp = modelo.img;
    }


    try {
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
        await modelo.save();

        const imagePath = path.join(__dirname, '../uploads/', coleccion, nameTemp);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ Error: `Error al subir el archivo - ${error}` });
    }



    res.status(200).json({ modelo });
}


const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let tempName = '';
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con id: ${id}` })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con id: ${id}` })
            }
            break;

        default:
            return res.status(500).json({ msg: 'not found' })
    }


    if (modelo.img) {
        tempName = modelo.img;
    }

    try {
        // Upload the image
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;

        await modelo.save();


        //Delete prev image
        const nombreArr = tempName.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const id = nombre.split('.').at(0);
        cloudinary.uploader.destroy(id);


        return res.json(modelo);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ Error: `Error al subir el archivo - ${error}` });
    }
}




const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con id: ${id}` })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con id: ${id}` })
            }
            break;

        default:
            return res.status(500).json({ msg: 'not found' })
    }

    if (modelo.img) {
        const imagePath = path.join(__dirname, '../uploads/', coleccion, modelo.img);
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
    }

    const notFoundPath = path.join(__dirname, '../assets/no-image.jpg');
    return res.status(200).sendFile(notFoundPath);
}







module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}