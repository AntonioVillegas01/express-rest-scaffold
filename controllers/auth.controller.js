const {request, response} = require("express");
const Usuario = require('../models/usuario.model')
const bcrypt = require('bcryptjs')
const {generarJwt} = require("../helpers/generar-jwt");
const {googleVerify} = require("../helpers/google-verify");


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


const loginGoogleController = async (req = request, res = response) => {

    const {id_token} = req.body;
    try {

        const {correo, nombre, img}  = await googleVerify(id_token)

        let usuario = await Usuario.findOne({correo})

        if(!usuario){
            // crear el usuario con la info de google
            const data ={
                nombre,
                correo,
                password: ':q',
                img,
                google: true
            }
            usuario = new  Usuario(data)
            await usuario.save();
        }

        if(!usuario.estado){
          return   res.status(401).json({
                msg: 'Este usuario ha sido deshabilitado',

            })
        }

        // Generar JWT
        const token = await generarJwt(usuario.id)


        res.json({
            usuario,
            token
        })

    }catch (e) {
        console.log(e)
        res.status(400).json({
            msg: 'Ocurrio un error',
        })
    }


}


const registerController = (req = request, res = response) => {

}


module.exports = {
    loginController,
    registerController,
    loginGoogleController
}