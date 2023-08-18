
const url = '/api/auth/'
let user = null;
let socket = null;



//HTML REFERECES
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

const validarJWT = async () => {

    const tokenDB = localStorage.getItem('token') || '';

    if (tokenDB.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'x-token': tokenDB }
    })

    const { usuario, token } = await resp.json();
    localStorage.setItem('token', token)
    user = usuario;

    document.title = usuario.nombre;

    await conectarSocket();
};


const conectarSocket = async () => {
    socket = io({
        extraHeaders: {
            "x-token": localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log("Sockets online")
    })
    socket.on('disconnect', () => {
        console.log("Sockets offline")
    })
    socket.on('recibir-mensajes', (payload) => {
        console.log(payload)
        mostrarMensajes(payload)
    })
    socket.on('usuarios-activos', (payload) => {
        mostrarUsuarios(payload);
    })
    socket.on('mensaje-privado', (payload) => {
        console.log(payload)
    })


}

const mostrarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ nombre, _id }) => {

        usersHtml += ` 
        <li>
            <p>
                <h5 class="text-success"> ${nombre}</h5>
                <span>${_id}</span>
            </p>
        </li>
        `
    })
    ulUsuarios.innerHTML = usersHtml;
}

const mostrarMensajes = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach(({ nombre, mensaje }) => {

        mensajesHtml += ` 
        <li>
            <p>
                <span class="text-primary">${nombre}:</span>
                <span>${mensaje}</span>
            </p>
        </li>
        `
    })
    ulMensajes.innerHTML = mensajesHtml;
}


txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value.trim();
    const id = txtUid.value.trim();

    if (keyCode != 13) { return }
    if (mensaje.length === 0) { return }

    socket.emit('enviar-mensaje', { mensaje, id })

    txtMensaje.value = '';
})

const main = async () => {

    await validarJWT();

}
main();