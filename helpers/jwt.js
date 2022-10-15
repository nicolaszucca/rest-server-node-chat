const jwt = require('jsonwebtoken');


const generarJWT = (id) => {

    return new Promise((resolve, reject) => {
        const payload = { id };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, (err, jwt) => {

            if (err) {
                console.log(err)
                reject('No se pudo generar el token');

            } else {
                resolve(jwt);
            }
        })
    })
}




module.exports = {
    generarJWT
}