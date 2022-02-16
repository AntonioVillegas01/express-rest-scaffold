const {Router} = require("express");
const {loginController, registerController, loginGoogleController} = require("../controllers/auth.controller");
const {check} = require("express-validator");
const {validatarCampos} = require("../middlewares/validatar-campos");


const router =  Router()

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    validatarCampos
] ,loginController )


router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validatarCampos
] ,loginGoogleController )

router.post('/register',[

] ,registerController )


module.exports = router