const {response, request} = require('express')



const getUsuarios = (req= request, res = response) =>{

    const {q,nombre= 'no name',apikey} = req.query

    res.json({
        msg:'GET Usuarios Controller',
        q,
        nombre,
        apikey
    })
}

const updateUsuarios = (req, res = response) =>{

    const {id} = req.params

    res.json({
        msg:'PUT Usuarios Controller',
        id
    })
}

const createUsuarios = (req, res = response) =>{

    const {nombre, edad} = req.body



    res.json({
        msg:'POST Usuarios Controller',
        nombre,
        edad
    })
}

const deleteUsuarios = (req, res = response) =>{
    res.json({
        msg:'DELETE Usuarios Controller'
    })
}



module.exports = {
    getUsuarios,
    updateUsuarios,
    createUsuarios,
    deleteUsuarios

}