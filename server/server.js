require("dotenv").config()

const express = require("express")
const cors = require("cors")

const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")

const mongoose = require("mongoose")

const PORT = process.env.PORT || 2915
const app = express()
const path = require('path')
const  ErrorHandler  = require("./middleware/errorHandler")

connectDB()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))

app.use("/api/auth", require("./routes/authRouter"))
app.use("/api/user", require("./routes/userRouter"))
app.use("/api/company", require("./routes/companyRouter"))
app.use("/api/watch", require("./routes/watchRouter"))
app.use("/api/purchase", require("./routes/purchaseRouter"))
app.use("/api/mail", require('./routes/mailRouter'))

app.get("/", (req, res) => {
    res.send("this is the home page")
})

app.get('/uploads/:filename', (req, res) => {
    const imagePath = path.join(__dirname, '/public/uploads/', req.params.filename);
    res.sendFile(imagePath, { headers: { 'Content-Type': 'image/jpeg' } });
});

app.use('/uploads', express.static(__dirname + '/public/uploads'));

app.use(ErrorHandler)

mongoose.connection.once('open', () => {
    console.log('Connect to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})