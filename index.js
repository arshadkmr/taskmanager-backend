const dotenv = require("dotenv");

const express = require('express');
const app = express();
const cors = require("cors")

app.use(express.json())
app.use(cors())
dotenv.config()

const db = require("./models")

//Routers
const userRouter = require('./routes/userRoute')

app.use('/user', userRouter)

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('listening on port 3001');
    })
})
