
const express=require("express")
const router=express.Router()
const userController=require("../controllers/userController")
const verifyJWT = require("../middleware/verifyJWT")

router.put('/',verifyJWT,userController.updateUser)
router.put('/updatePassword',userController.updatePassword)
router.get('/favorite',verifyJWT,userController.getFavoriteWatches)

module.exports=router