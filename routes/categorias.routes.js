const {Router} = require("express");

const {check} = require("express-validator");

const {
    validatarCampos,
    validarJwt,
    isAdminRole,
    tienRole
} = require('../middlewares')
const {crearCategoriaController, obtenerCategoriasController, obtenerCategoriaPorIdController,
    actualizarCategoriaController, eliminarCategoriaController
} = require("../controllers/categoria.controller");
const {existeCategoriaPorId} = require("../helpers/db-validators");


const router = Router();

// Obtener todas la categorias  - publico
router.get('/', obtenerCategoriasController )


//Obtener una categoria por id
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validatarCampos
], obtenerCategoriaPorIdController)


//Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validatarCampos
],crearCategoriaController)


//Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id',[
    validarJwt,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validatarCampos
], actualizarCategoriaController)


//Borrar categoria - privado - solo admin
router.delete('/:id', [
    validarJwt,
    isAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validatarCampos
],eliminarCategoriaController)

module.exports = router