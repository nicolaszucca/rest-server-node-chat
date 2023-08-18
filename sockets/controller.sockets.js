const { comprobarJWT } = require("../middlewares/validar-jwt");

const { ChatMensajes } = require("../models");
const chatMensajes = new ChatMensajes()

const socketController = async (socket, io) => {
    //Validar jwt 
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if (!usuario) { return socket.disconnect() }

    //agregar usuario existente conectado:
    chatMensajes.agregarUsuario(usuario);

    io.emit('usuarios-activos', chatMensajes.usuariosArr)

    socket.join(usuario.id)

    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje', ({ mensaje, id }) => {

        if (id) {

            socket.to(id).emit('mensaje-privado', { de: usuario.nombre, mensaje: mensaje })

        } else {

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }
    })
}

module.exports = {
    socketController
}