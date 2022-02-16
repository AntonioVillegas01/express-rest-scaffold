const {Router} = require("express");
const {check} = require("express-validator");
const {cargarArchivo, actualizarImagen} = require("../controllers/uploads.controller");
const {validarJwt, validatarCampos} = require("../middlewares");
const {coleccionesPermitidas} = require("../helpers");


const router =  Router()


router.post('/',[
    validarJwt
],cargarArchivo )

router.put('/:coleccion/:id',[
    validarJwt,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion'). custom(colleccion => coleccionesPermitidas(colleccion,['usuarios', 'productos'])),
    validatarCampos
],actualizarImagen )


module.exports = router