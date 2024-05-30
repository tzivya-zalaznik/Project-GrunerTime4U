
const Watch = require("../models/Watch")

const createWatch = async (req, res) => {
    const { company, companyBarcode, actualCost, price, disPrice, otherColors, size, description, barcode, quantity, category } = req.body
    const imageUrl = req.file.path;
    if (!company || !imageUrl || !companyBarcode || !actualCost || !price || !size || !description || !barcode || !quantity || !category)
        return res.status(400).json({ message: 'missing required feilds' })
    const watch = await Watch.create({ company, imageUrl, companyBarcode, actualCost, price, disPrice, otherColors:otherColors.split(","), size, description, barcode, quantity, category })
    if (watch)
        return res.status(201).json({ message: 'New watch created' })
    else
        return res.status(400).json({ message: 'Invalid watch' })
}

const getAllWatches = async (req, res) => {
    const watch = await Watch.find().lean().populate('company', { imageUrl: 1, name: 1 })
    if (!watch?.length)
        return res.status(400).json({ message: 'No watch found' })
    res.json(watch)
}

const getWatchByID = async (req, res) => {
    const { id } = req.params
    const watch = await Watch.findById(id).lean().populate('company', { imageUrl: 1 })
    if (!watch) {
        return res.status(400).send(`There is no watch with id:${id}  :(`)
    }
    console.log(watch);
    res.json(watch)
}

const updateWatch = async (req, res) => {
    const { _id, company, companyBarcode, actualCost, price, disPrice, otherColors, size, description, barcode, quantity, category, isImgUpdate } = req.body
    if (!_id) {
        return res.status(400).send("Missing required feilds")
    }
    const watch = await Watch.findById(_id).exec()
    if (!watch) {
        return res.status(400).send(`There is no watch with id:${_id}  :(`)
    }
    if (isImgUpdate) {
        watch.imageUrl = req.file.path;
        watch.company = company
        watch.companyBarcode = companyBarcode
        watch.actualCost = actualCost
        watch.price = price
        watch.disPrice = disPrice
        watch.otherColors = otherColors.split(",");
        watch.size = size
        watch.description = description
        watch.barcode = barcode
        watch.quantity = quantity
        watch.category = category
        await watch.save()
        res.send(`${watch.companyBarcode} is updated`)
    }
    else {
        watch.company = company._id
        watch.companyBarcode = companyBarcode
        watch.actualCost = actualCost
        watch.price = price
        watch.disPrice = disPrice
        watch.otherColors = otherColors
        watch.size = size
        watch.description = description
        watch.barcode = barcode
        watch.quantity = quantity
        watch.category = category
        await watch.save()
        res.send(`${watch.companyBarcode} is updated`)
    }
}

const deleteWatch = async (req, res) => {
    const { id } = req.params
    const watch = await Watch.findById(id).exec()
    if (!watch) {
        return res.status(400).send(`There is no watch with id:${id}  :(`)
    }
    await watch.deleteOne()
    res.send(`watch ${watch.companyBarcode} is deleted`)
}

module.exports = { createWatch, getAllWatches, getWatchByID, updateWatch, deleteWatch }