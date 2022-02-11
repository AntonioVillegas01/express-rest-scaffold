const Role = require("../models/role.model");
const Usuario = require("../models/usuario.model");


const esRolValido = async (rol = '')=> {
    const existeRol = await Role.findOne({rol})
    if(!existeRol){
        throw new Error(`El rol ${rol} no es un rol válido`)
    }
}

const emailExiste = async  (correo) => {

    const existeEmail = await Usuario.findOne({correo})
    if(existeEmail){
        throw new Error(`El correo ${correo} ya existe en nuestra base de datos.`)
    }
}


const existeUsuarioPorId = async  (id = '') => {
    // Verificar si existe Email
    const existeUsuario = await Usuario.findById(id)
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`)
    }
}


module.exports={
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}