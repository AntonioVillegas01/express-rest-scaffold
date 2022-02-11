const express = require("express");
const cors = require("cors");
const {dbConnection} = require("../db/config.db");

class Server{

    constructor() {
        this.app  = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'

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

    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/user.routes'))
        this.app.use(this.authPath, require('../routes/auth.routes'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Escuchando en puerto ${this.port}`)
        })
    }
}

module.exports = Server