const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundUser = await User.findOne({ email }).lean()
    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    const userInfo = { _id: foundUser._id, name: foundUser.name, password: foundUser.password, role: foundUser.role, email: foundUser.email, watches: foundUser.watches }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken,user:{id:userInfo._id,name:userInfo.name,watches:userInfo.watches}})
}

const register = async (req, res) => {
    const { name, password, email, isAdmin } = req.body
    let role;
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            const user = decoded
            role=user.role
        })
    }
    if (!name || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ email: email }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { name, email, password: hashedPwd, role }
    const user = await User.create(userObject)
    if (user) {
        return res.status(201).json({ message: `New user ${user.name} created` })
    }
    else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}

module.exports = { login, register }