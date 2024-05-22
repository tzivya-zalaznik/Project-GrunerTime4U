
const express = require("express")
const router = express.Router()

const purchaseController = require("../controllers/purchaseController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)
router.use(verifyAdmin)

router.post('/', purchaseController.createPurchase)
router.get('/', purchaseController.getAllPurchases)
router.get('/:id', purchaseController.getPurchaseByID)
router.delete('/:id', purchaseController.deletePurchase)

module.exports = router