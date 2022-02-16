const {Router} = require('express')
const {buscarController} = require("../controllers/buscar.controller") ;


const router = Router()

router.get('/:coleccion/:termino', buscarController)


module.exports= router