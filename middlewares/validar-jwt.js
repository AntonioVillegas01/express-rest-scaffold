const {request, response} = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario.model')

const validarJwt =async (req= request, res= response, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }
    
    try {

       const payload = jwt.verify(token, process.env.SECRETPRIVATEKEY);

       // leer el usuario correspondiente al id
       const usuario = await  Usuario.findById(payload.uid)

        if(!usuario){
            res.status(401).json({
                msg:'Usuario no existe en BD'
            })
        }

        // Verificar si el uid tiene estado en true
        if(!usuario.estado){
            res.status(401).json({
                msg:'Token no valido- usuario con estado false'
            })
        }

       req.usuario = usuario

        next();
        
    }catch (e) {
        console.log(e)
        res.status(401).json({
            msg: 'Invalid Token'
        })
    }
}

module.exports={
    validarJwt
}