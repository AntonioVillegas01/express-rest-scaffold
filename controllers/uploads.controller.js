const {request, response} = require("express");
const {subirArchivo} = require("../helpers");
const {Usuario, Producto} = require("../models");


const cargarArchivo = async (req = request, res = response) => {

    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                msg: 'No se seleccionaron archivos '
            });

        }

        if (!req.files.archivo || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                msg: 'No se seleccionaron archivos '
            });

        }

        try {
            // const {path, nombre} = await subirArchivo(
            //     req.files,
            //     ['txt','md'],
            //     'textos'
            //     );
            const {path, nombre} = await subirArchivo(
                req.files,
                undefined,
                'imgs'
            );

            return res.json({
                path,
                nombre
            })

        } catch (msg) {

            return res.status(400).json({
                msg
            })
        }


    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}


const actualizarImagen = async (req = request, res = response) => {

    const {coleccion, id} = req.params

    let modelo;
    try {
        switch (coleccion) {
            case 'usuarios':

                modelo = await Usuario.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    })
                }

                break;
            case 'productos':

                modelo = await Producto.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;

            default:
                return res.status(500).json({
                    msg: 'Se me olvido olvidar esto'
                })
        }

        const {path, nombre} = await subirArchivo(
            req.files,
            undefined,
            coleccion
        );

        modelo.img = nombre
        await modelo.save()


        return res.status(200).json({
            modelo
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Ocurrio un error'
        })
    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen
}