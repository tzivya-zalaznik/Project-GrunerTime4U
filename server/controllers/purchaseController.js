
const Purchase = require("../models/Purchase")

const createPurchase = async (req, res) => {
    const { name, phone, date, originalPrice, paid, watch } = req.body
    if (!name || !phone || !date || !originalPrice || !paid || !watch)
        return res.status(400).json({ message: 'missing required feilds' })
    const purchase = await Purchase.create({ name, phone, date, originalPrice, paid, watch })
    if (purchase)
        return res.status(201).json({ message: 'New purchase created' })
    else
        return res.status(400).json({ message: 'Invalid purchase' })
}

const getAllPurchases = async (req, res) => {
    const purchase = await Purchase.find().lean()
    if (!purchase?.length)
        return res.status(400).json({ message: 'No purchase found' })
    res.json(purchase)
}

const getPurchaseByID = async (req, res) => {
    const { id } = req.params
    const purchase = await Purchase.findById(id).lean()
    if (!purchase) {
        return res.status(400).send(`There is no purchase with id:${id}  :(`)
    }
    res.json(purchase)
}

const deletePurchase = async (req, res) => {
    const { id } = req.params
    const purchase = await Purchase.findById(id).exec()
    if (!purchase) {
        return res.status(400).send(`There is no purchase with id:${id}  :(`)
    }
    await purchase.deleteOne()
    res.send(`purchase ${purchase.name} is deleted`)
}

module.exports = { createPurchase, getAllPurchases, getPurchaseByID, deletePurchase }