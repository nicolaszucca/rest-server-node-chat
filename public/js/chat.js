
const url = '/api/auth/'
let user = null;
let socket = null;

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


const main = async () => {

    await validarJWT();

}
main();



const conectarSocket = async () => {
    const socket = io({
        extraHeaders: {
            "x-token": localStorage.getItem('token')
        }
    });;
}