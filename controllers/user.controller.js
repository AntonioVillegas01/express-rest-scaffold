const {response, request} = require('express')
const Usuario = require('../models/usuario.model')
const bcryptjs = require("bcryptjs");



const getUsuarios =async (req= request, res = response) =>{

    const {limite = 5, desde= 0} = req.query

    // parametro para regresar los docs que cumplan la condicio
    const query = {estado:true}

    /*
    *  IMPORTANTE
    *  PAra ejecutar las dos consultas de manera pararela
    * Se usa la desestructuracion de arreglos
    * */
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .limit(Number(limite))
            .skip(desde)
    ])


    res.json({
        total,
        usuarios
    })
}

const updateUsuarios = async (req, res = response) =>{

    const {id} = req.params
    const{_id, password, google, ...rest} = req.body;


    // todo validar en bd

    if(password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, rest);


    res.json({
        usuario
    })
}

const createUsuarios = async (req, res = response) =>{

    try{
        const {nombre, correo, password, rol} = req.body

        const usuario = new Usuario( {
            nombre,
            correo,
            password,
            rol
        });



        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt)

        await usuario.save();


        res.json({
            usuario
        })

    }catch (e) {
        console.log(e)
        res.status(500).json({
            msg: 'Ocurrio un Error'
        })
    }


}

const deleteUsuarios = async (req, res = response) =>{

    const {id} = req.params

    const uid = req.uid

    // Borrado Fisicom
    // const usuario = await Usuario.findByIdAndDelete(id)

    // Borrado Logico
    const usuario = await  Usuario.findByIdAndUpdate(id, {estado:false})
    const usuarioAutenticado = req.usuario

    res.json({
        usuario,
    })
}



module.exports = {
    getUsuarios,
    updateUsuarios,
    createUsuarios,
    deleteUsuarios

}