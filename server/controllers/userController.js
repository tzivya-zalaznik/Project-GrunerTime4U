
const User = require("../models/User")
const bcrypt = require('bcrypt')
const Watch = require("../models/Watch")

const updateUser = async (req, res) => {
    const { watches } = req.body
    const user = await User.findById(req.user._id).exec()
    if (!user) {
        return res.status(400).send(`There is no user with id:${_id}  :(`)
    }
    user.watches = watches
    await user.save()
    res.json({user:{id:user._id,name:user.name,watches:user.watches}})
}

const getFavoriteWatches = async (req, res) => {
    const user = await User.findById(req.user._id).exec()
    if (!user)
        return res.status(400).json({ message: 'No user found' })
    const userWithWatches = await Promise.all(user.watches.map(async (id)=>{
        const watch=await Watch.findById(id).lean().populate('company',{imageUrl:1})
        return watch
    }))
    res.json(userWithWatches)
}

const updatePassword = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    foundUser.password = hashedPwd
    await foundUser.save()
    return res.status(201).json({ message: `Update ${foundUser.name} password` })
}

module.exports = { updateUser, getFavoriteWatches, updatePassword }