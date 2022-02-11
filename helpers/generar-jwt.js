const jwt = require("jsonwebtoken");

const generarJwt = (uid = '') => {

    return new Promise(((resolve, reject) => {

        const payload = {uid};

        jwt.sign(payload, process.env.SECRETPRIVATEKEY, {
            expiresIn: '4h'
            }, (err, token) => {
                if (err) {
                    console.log(err)
                    reject('Error al generar el token')
                } else {
                    resolve(token)
                }
            }
        )
    }))


}


module.exports = {
    generarJwt
}