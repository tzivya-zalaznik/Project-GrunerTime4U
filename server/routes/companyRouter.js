const express=require("express")
const router=express.Router()

const companyController=require("../controllers/companyController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, res, cb){
        cb(null, './public/uploads')
    },
    filename : function(req, res, cb){
        const uniqeSuffix = Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null, uniqeSuffix +".jpg")
    }
})
const upload = multer({storage:storage})

router.post('/',verifyJWT, verifyAdmin,upload.single('imageUrl'),companyController.createCompany)
router.get('/',companyController.getAllCompanies)
router.put('/',verifyJWT,verifyAdmin, upload.single('imageUrl'),companyController.updateCompany)
router.delete('/:id',verifyJWT,verifyAdmin,companyController.deleteCompany)

module.exports=router