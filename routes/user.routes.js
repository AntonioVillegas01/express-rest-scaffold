const {Router} = require("express");
const {
    getUsuarios,
    updateUsuarios,
    createUsuarios,
    deleteUsuarios
} = require("../controllers/user.controller");
const {check} = require("express-validator");

const Role = require('../models/role.model')
const {esRolValido, emailExiste, existeUsuarioPorId} = require("../helpers/db-validators");

const {
    validatarCampos,
    validarJwt,
    isAdminRole,
    tienRole
} = require('../middlewares')


const router = Router();


router.get('/', getUsuarios)
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de 6 ').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    validatarCampos
], createUsuarios)
router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validatarCampos
], updateUsuarios)
router.delete('/:id', [
    validarJwt,
    // isAdminRole, // debe estar despues de validarJWT
    tienRole('ADMIN_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validatarCampos,
], deleteUsuarios)

module.exports = router