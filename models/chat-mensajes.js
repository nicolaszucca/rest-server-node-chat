
class Mensaje {
    constructor(id, nombre, mensaje) {
        this.id = id; //DB id 
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}

class ChatMensajes {
    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(-10);
        return this.mensajes
    }

    get usuariosArr() {
        return Object.values(this.usuarios);
    }

    enviarMensaje(id, nombre, mensaje) {
        this.mensajes.push(new Mensaje(id, nombre, mensaje));
    }

    agregarUsuario(usuario) {
        this.usuarios[usuario.id] = usuario
    }

    desconectarUsuario(id) {
        delete this.usuarios[id];
    }
}

module.exports = ChatMensajes