const mongoose = require("mongoose");


const dbConnection = async ()=>{
    try {

       await mongoose.connect(process.env.MONGODB_CNN)

        console.log('Base de Datos online')

    }catch (e) {
        console.log(e)
        throw new Error('Error en la conexion a la BD')
    }
}


module.exports={
    dbConnection
}