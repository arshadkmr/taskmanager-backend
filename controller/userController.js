const asyncHandler = require("express-async-handler");
const { User, Tasks } = require("../models")
const bcrypt = require("bcrypt")
const generateToken = require('../util/token');

let token


const insertUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, cPassword } = req.body
        const userExists = await User.findOne({ where: { email } })
        if (userExists) {
            res.json({
                errorMessage: "User already exists"
            })
        } else {
            if (password === cPassword) {
                const salt = bcrypt.genSaltSync(10)
                const hashPassword = await bcrypt.hash(password, salt)
                if (hashPassword) {
                    const newUser = await User.create({
                        name, email, password: hashPassword
                    })
                    if (newUser) {
                        res.json({
                            name,
                            email,
                            password: hashPassword,
                            successMessage: "Form submitted successfully"
                        })
                    }
                }
            } else {
                res.json({
                    errorMessage: "Password mismatch"
                })
            }
        }
    }
    catch (error) {
        console.log("error : ", error)
    }
})

const userLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await User.findOne({ where: { email } })
        if (userData) {
            const userPassword = await bcrypt.compare(password, userData.dataValues.password)
            if (userPassword) {
                res.json({
                    email: userData.dataValues.email,
                    token: generateToken(userData.dataValues.id),
                    successMessage: "Login success"
                })
                token = generateToken(userData.dataValues.id)
            } else {
                res.json({
                    errorMessage: "Incorrect password"
                })
                token = null
            }
        } else {
            res.json({
                errorMessage: "User not found"
            })
        }
    } catch (error) {
        console.log(error.message)
    }
})

const insertTask = asyncHandler(async (req, res) => {
    try {
        const user = req.user
        const taskData = req.body
        if (token !== null) {
            const task = await Tasks.create({
                title: taskData.title,
                description: taskData.description,
                progress: taskData.progress,
                startDate: taskData.startDate,
                endDate: taskData.endDate,
                userId: user.id
            })
            if (task) {
                res.json({
                    successMessage: "Task created successfully"
                })
            }
        }
    } catch (error) {
        console.log(error.message)
    }
})

const loadTask = asyncHandler(async (req, res) => {
    try {
        const user = req.user
        const listOfTask = await Tasks.findAll({ where: { userId: user.id } })
        if (listOfTask) {
            res.json(listOfTask)
        } else {
            res.json({
                errorMessage: "No tasks found"
            })
        }
    } catch (error) {
        console.log("error", error)
    }
})

const loadEdit = asyncHandler(async (req, res) => {
    try {
        const user = req.user
        const id = req.params.id
        if (user) {
            const taskData = await Tasks.findOne({ where: { id } })
            console.log("taskData", taskData)
            if (taskData) {
                res.json({
                    taskData
                })
            } else {
                res.json({
                    errorMessage: "No tasks found"
                })
            }
        }
    } catch (error) {
        console.log(error.message)
    }
})

const updateEdit = asyncHandler(async (req, res) => {
    try {
        const user = req.user
        const taskInfo = req.body
        console.log("taskInfo : ", taskInfo)
        const id = req.params.id
        if (user) {
            const taskData = await Tasks.findOne({ where: { id } })
            if (taskData) {
                if (taskInfo.progress === 100) {
                    const updatedTask = await taskData.update({
                        title: taskInfo.title,
                        description: taskInfo.description,
                        progress: taskInfo.progress,
                        startDate: taskInfo.startDate,
                        endDate: taskInfo.endDate,
                        status: 1
                    });
                    if (updatedTask) {
                        res.json({
                            successMessage: "Task updated successfully"
                        })
                    } else {
                        res.json({
                            errorMessage: "Task updating failed"
                        })
                    }
                } else {
                    const updatedTask = await taskData.update({
                        title: taskInfo.title,
                        description: taskInfo.description,
                        progress: taskInfo.progress,
                        startDate: taskInfo.startDate,
                        endDate: taskInfo.endDate
                    })
                    if (updatedTask) {
                        res.json({
                            successMessage: "Task updated successfully"
                        })
                    } else {
                        res.json({
                            errorMessage: "Task updating failed"
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message)
    }
})

const deleteTask = asyncHandler(async (req, res) => {
    try {
        const user = req.user
        const id = req.params.id
        if (user) {
            const taskData = await Tasks.findOne({ where: { id } })
            if (taskData) {
                const updateTask = await taskData.destroy()
                if (updateTask) {
                    res.json({ successMessage: "Task deleted successfully" })
                }else{
                    res.json({errorMessage:"Task deleted failed"})
                }
            }
        }

    } catch (error) {
        console.log(error.message)
    }
})

module.exports = {
    loadTask,
    insertUser,
    userLogin,
    insertTask,
    loadEdit,
    updateEdit,
    deleteTask
}