const {Router} = require("express");
const {
    getUsuarios,
    updateUsuarios,
    createUsuarios,
    deleteUsuarios
} = require("../controllers/user.controller");


const router = Router();


router.get('/', getUsuarios)
router.post('/', createUsuarios)
router.put('/:id', updateUsuarios)
router.delete('/:id', deleteUsuarios)

module.exports = router