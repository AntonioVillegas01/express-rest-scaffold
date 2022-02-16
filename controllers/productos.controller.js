const {Producto} = require("../models");
const {request, response} = require("express");

// obtener Productos - paginado - total - populate
const obtenerProductosController = async (req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query
    // parametro para regresar los docs que cumplan la condicio
    const query = {estado: true}
    try {

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .limit(Number(limite))
                .skip(desde)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ])


        return res.status(200).json({
            total,
            productos
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}

// obtener Producto por ID -  populate
const obtenerProductoPorIdController = async (req = request, res = response) => {

    const {id} = req.params
    try {
        const producto = await Producto.findById(id)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
        
        if (!producto) {
            return res.status(404).json({
                msg: `La producto no existe con el id: ${id}`
            })
        }

        return res.status(200).json({
            producto
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}


// crear producto
const crearProductoController = async (req, res) => {

    const {estado, usuario, ...body} = req.body

    try {
        const productoDB = await Producto.findOne({nombre: body.nombre})

        if (productoDB) {
            res.status(400).json({
                msg: `El producto ${productoDB.nombre}, ya existe`
            })
        }
        // Generar la data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }
        const producto = new Producto(data)
        await producto.save()
        return res.status(201).json({
            producto
        })
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            msg: 'Ocurrio un error al guardar la producto'
        })
    }
}


// Actualizar Producto -  populate
const actualizarProductosController = async (req = request, res = response) => {

    const {id} = req.params
    const {estado, usuario, ...rest} = req.body

    if(!rest.nombre){
      return  res.status(400).json({
            msg: 'El nombre del producto es requerido'
        })
    }
    rest.nombre = rest.nombre.toUpperCase()
    // Obtener el usuario que esta actualizando
    rest.usuario = req.usuario._id

    try {
        const producto = await Producto.findByIdAndUpdate(id, rest, {
            new: true
        })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')


        return res.status(200).json({
            msg: `La producto ${producto.nombre} se actualizo correctamente`,
            producto
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}

// Borrar Producto - estado: false
const eliminarProductosController = async (req = request, res = response) => {


    const {id} = req.params
    try {

        // Borrado Logico
        const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new:true})


        return res.status(200).json({
            producto
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}
module.exports = {
    obtenerProductosController,
    obtenerProductoPorIdController,
    actualizarProductosController,
    crearProductoController,
    eliminarProductosController
}