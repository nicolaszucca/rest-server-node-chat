const { comprobarJWT } = require("../middlewares/validar-jwt");



const socketController = async (socket) => {
    //Validar jwt 
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if (!usuario) { return socket.disconnect() }

    console.log(`${usuario.nombre} conectado`);
}

module.exports = {
    socketController
}