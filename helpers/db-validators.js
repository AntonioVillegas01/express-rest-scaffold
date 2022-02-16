const Role = require("../models/role.model");
const Usuario = require("../models/usuario.model");
const {Categoria, Producto} = require("../models");


const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol) {
        throw new Error(`El rol ${rol} no es un rol válido`)
    }
}

const emailExiste = async (correo) => {

    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en nuestra base de datos.`)
    }
}


const existeUsuarioPorId = async (id = '') => {
    // Verificar si existe Email
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`)
    }
}

const existeCategoriaPorId = async (id) => {

    const existeCategoriaPorId = await Categoria.findById(id)
    if (!existeCategoriaPorId) {
        throw new Error(`El id ${id} no existe en las categorias`)
    }
}

const existeProductoPorId = async (id) => {

    const existeProductoPorId = await Producto.findById(id)
    if (!existeProductoPorId) {
        throw new Error(`El id ${id} no existe en los productos`)
    }
}


const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion)
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - colecciones: ${colecciones}`)
    }
    return true
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}