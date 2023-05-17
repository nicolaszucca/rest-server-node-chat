const { v4: uuidv4 } = require('uuid');
const path = require('path');


const subirArchivo = (files, extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const dividedName = archivo.name.split(".");
        const extensionFile = dividedName.at(-1);


        if (!extensionesValidas.includes(extensionFile)) {
            return reject("El archivo no tiene una extension compatible");
        }

        const tempName = uuidv4() + "." + extensionFile;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, tempName);

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, function (err) {
            if (err) {
                console.log(err)
                return reject(err);
            }

            resolve(`${tempName}`);
        });
    })

}



module.exports = {
    subirArchivo,
}