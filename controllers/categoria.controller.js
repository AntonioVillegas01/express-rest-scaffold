const {Categoria} = require("../models");
const {request, response} = require("express");
const Usuario = require("../models/categoria.model");

// obtener Categorias - paginado - total - populate
const obtenerCategoriasController = async (req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query
    // parametro para regresar los docs que cumplan la condicio
    const query = {estado: true}
    try {

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .limit(Number(limite))
                .skip(desde)
                .populate('usuario', 'nombre')
        ])


        return res.status(200).json({
            total,
            categorias
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}

// obtener Categoria por ID -  populate
const obtenerCategoriaPorIdController = async (req = request, res = response) => {

    const {id} = req.params
    try {
        const categoria = await Categoria.findById(id).populate('usuario', 'nombre')
        if (!categoria) {
            return res.status(404).json({
                msg: `La categoria no existe con el id: ${id}`
            })
        }

        return res.status(200).json({
            categoria
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}


// crear categoria
const crearCategoriaController = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase();
    try {
        const categoriaDB = await Categoria.findOne({nombre})

        if (categoriaDB) {
         return   res.status(400).json({
                msg: `La categoría ${categoriaDB.nombre}, ya existe`
            })
        }
        // Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        }
        const categoria = new Categoria(data)
        await categoria.save()
        return res.status(201).json({
            categoria
        })
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            msg: 'Ocurrio un error al guardar la categoria'
        })
    }
}


// Actualizar Categoria -  populate
const actualizarCategoriaController = async (req = request, res = response) => {

    const {id} = req.params
    const {estado, usuario, ...rest} = req.body

    rest.nombre = rest.nombre.toUpperCase()
    // Obtener el usuario que esta actualizando
    rest.usuario = rest.usuario._id

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, rest, {
            new: true
        }).populate('usuario', 'nombre')


        return res.status(200).json({
            msg: `La categoria ${categoria.nombre} se actualizo correctamente`,
            categoria
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}

// Borrar Categoria - estado: false
const eliminarCategoriaController = async (req = request, res = response) => {


    const {id} = req.params
    try {

        // Borrado Logico
        const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true})


        return res.status(200).json({
            categoria
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}
module.exports = {
    obtenerCategoriasController,
    obtenerCategoriaPorIdController,
    actualizarCategoriaController,
    crearCategoriaController,
    eliminarCategoriaController
}