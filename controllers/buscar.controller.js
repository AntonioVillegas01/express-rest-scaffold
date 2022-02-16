const {request, response} = require("express");
const {Usuario, Categoria, Producto} = require("../models");
const {ObjectId} = require('mongoose').Types



const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino= '', res=response)=>{

    const isMongoId = ObjectId.isValid(termino) // -> true

    if(isMongoId){
        const usuario = await Usuario.findOne({termino})
        console.log(usuario)
       return   res.json({
           results: usuario ? [usuario] : []
       })
    }

    const regex = new RegExp(termino, 'i')
    const query = {estado: true}

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find({
            $or:[{nombre: regex }, {correo: regex}],
            $and:[{estado:true}]
        })
    ])

    return   res.json({
        totalUsuariosActivos: total,
        totalEncontrados: usuarios.length,
        results: usuarios
    })
}


const buscarCategorias = async (termino= '', res=response)=>{

    const isMongoId = ObjectId.isValid(termino) // -> true

    if(isMongoId){
        const categoria = await Categoria.findOne({termino})
        console.log(categoria)
       return   res.json({
           results: categoria ? [categoria] : []
       })
    }

    const regex = new RegExp(termino, 'i')
    const query = {estado: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find({
            $or:[{nombre: regex }],
            $and:[{estado:true}]
        })
    ])

    return   res.json({
        totalCategoriasActivos: total,
        totalEncontradas: categorias.length,
        results: categorias
    })
}


const buscarProductos = async (termino= '', res=response)=>{

    const isMongoId = ObjectId.isValid(termino) // -> true

    if(isMongoId){
        const producto = await Producto.findOne({termino}).populate('categoria', 'nombre')
        console.log(producto)
       return   res.json({
           results: producto ? [producto] : []
       })
    }

    const regex = new RegExp(termino, 'i')
    const query = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find({
            $or:[{nombre: regex }],
            $and:[{estado:true}]
        }).populate('categoria', 'nombre')
    ])

    return   res.json({
        totalProductosActivos: total,
        totalEncontrados: productos.length,
        results: productos
    })
}

const buscarController = async (req = request, res = response) => {

    const {coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return    res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    try {

        switch (coleccion) {
            case 'usuarios':
                buscarUsuarios(termino, res)
                break;
            case 'categoria':
                buscarCategorias(termino,res)
                break;
            case 'productos':
                buscarProductos(termino,res)
                break;

            default:

                return  res.status(500).json({
                msg: `Este mensaje no deberia salir`
            })
        }




     // return   res.status(200).json({
     //      coleccion,
     //     termino
     //    })

    } catch (e) {
        console.log(e);
        return    res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}


module.exports={
    buscarController
}