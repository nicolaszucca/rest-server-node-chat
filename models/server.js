const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const fileUpload = require('express-fileupload');

const { dbConection } = require('../dataBase/config');
const { socketController } = require('../sockets/controller.sockets');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categories: '/api/categories',
            products: '/api/productos',
            uploads: '/api/uploads',
            users: '/api/users',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConection();
    }

    sockets() {
        this.io.on("connection", socketController);
    }


    middlewares() {
        //Cors
        this.app.use(cors())

        //Lectura y parseo del body
        this.app.use(express.json())

        //Directorio público
        this.app.use(express.static('public'));

        //Express-fileUpload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/user.auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categories, require('../routes/category.routes'));
        this.app.use(this.paths.products, require('../routes/productos.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
        this.app.use(this.paths.users, require('../routes/user.routes'));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Funcionando en el puerto:', this.port);
        });
    }
}


module.exports = Server