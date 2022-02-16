const {Router} = require("express");

const {check} = require("express-validator");

const {
    validatarCampos,
    validarJwt,
    isAdminRole,
    tienRole
} = require('../middlewares')

const {
    existeProductoPorId,
    existeCategoriaPorId
} = require("../helpers/db-validators");
const {
    obtenerProductosController,
    crearProductoController,
    actualizarProductosController,
    eliminarProductosController,
    obtenerProductoPorIdController
} = require("../controllers/productos.controller");


const router = Router();

// Obtener todas la productoss  - publico
router.get('/', obtenerProductosController )


//Obtener una productos por id
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validatarCampos
], obtenerProductoPorIdController)


//Crear productos - privado - cualquier persona con un token valido
router.post('/', [
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validatarCampos
],crearProductoController)


//Actualizar productos - privado - cualquier persona con un token valido
router.put('/:id',[
    validarJwt,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validatarCampos
], actualizarProductosController)


//Borrar productos - privado - solo admin
router.delete('/:id', [
    validarJwt,
    isAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validatarCampos
],eliminarProductosController)

module.exports = router