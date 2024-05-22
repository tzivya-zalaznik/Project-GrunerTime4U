
const User = require("../models/User")
const { getWatchByID } = require("./watchController")
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

module.exports = { updateUser, getFavoriteWatches }