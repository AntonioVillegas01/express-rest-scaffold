const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const {dbConnection} = require("../db/config.db");

class Server{

    constructor() {
        this.app  = express()
        this.port = process.env.PORT

        this.paths = {
            auth: '/api/auth',
            categorias:'/api/categorias',
            usuarios:'/api/usuarios',
            productos:'/api/productos',
            buscar:'/api/buscar',
            uploads:'/api/uploads',
        }

        // Conectar BD
        this.conectarDB()

        //Middlewares
        this.middlewares();

        // Rutas de la app
        this.routes();
    }

    async conectarDB(){
        await dbConnection()
    }



    middlewares(){
        // CORS
        this.app.use(cors())
        // PARSEO y lectura JSON
        this.app.use(express.json())
        // Directorio publico
        this.app.use(express.static('public'))
        // file upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'))
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'))
        this.app.use(this.paths.usuarios, require('../routes/user.routes'))
        this.app.use(this.paths.productos, require('../routes/productos.routes'))
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'))
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Escuchando en puerto ${this.port}`)
        })
    }
}

module.exports = Server