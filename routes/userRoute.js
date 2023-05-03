const express = require('express')
const userRouter = express.Router()
const userController=require("../controller/userController")
const protect = require("../middleware/userAuth")

userRouter.post("/register",userController.insertUser)
userRouter.post('/login',userController.userLogin)
userRouter.get("/task",protect,userController.loadTask)
userRouter.post("/task",protect,userController.insertTask)
userRouter.get("/edit/:id",protect,userController.loadEdit)
userRouter.post("/edit/:id",protect,userController.updateEdit)
userRouter.get("/delete/:id",protect,userController.deleteTask)


module.exports = userRouter