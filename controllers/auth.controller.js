const {request, response} = require("express");
const Usuario = require('../models/usuario.model')
const bcrypt = require('bcryptjs')
const {generarJwt} = require("../helpers/generar-jwt");


const loginController = async (req = request, res = response) => {

    const {correo, password} = req.body

    try {
        // verificar si el correo existe
        const usuario = await Usuario.findOne({correo})

        if(!usuario){
            return res.status(400).json({
                msg:'El usuario o contraseña no existe! - correo'
            })
        }

        // usuario activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'El usuario o contraseña no existe! estado: false'
            })
        }

        // contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if(!validPassword){
            return res.status(400).json({
                msg:'El usuario o contraseña no existe! - password'
            })
        }

        // Generar JWT
        const token = await generarJwt(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }


}


const registerController = (req = request, res = response) => {

}


module.exports = {
    loginController,
    registerController
}