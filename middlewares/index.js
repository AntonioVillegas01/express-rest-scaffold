

const validatarCampos = require("../middlewares/validatar-campos");
const validarJwt = require("../middlewares/validar-jwt");
const validaRoles = require("../middlewares/validar-roles");


module.exports ={
    ...validatarCampos,
    ...validarJwt,
    ...validaRoles
}