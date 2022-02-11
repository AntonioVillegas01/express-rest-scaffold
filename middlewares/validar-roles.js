
const isAdminRole = (req, res, next)=> {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Token needs to be verified before role'
        })
    }
    try{

        const {rol, nombre} = req.usuario

        if(rol!== 'ADMIN_ROLE'){
            return res.status(401).json({
                msg: `El ${nombre} no es administrador - No puede hacer eso`
            })
        }

        next();

    }catch (e) {
        console.log(e)
    }

}

const tienRole = (...roles)=> {

    return (req, res, next)=> {

        if(!req.usuario){
            return res.status(500).json({
                msg: 'Token needs to be verified before role'
            })
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicion requiere uno de estos roles ${roles}`
            })
        }

        next();
    }
}

module.exports={
    isAdminRole,
    tienRole
}